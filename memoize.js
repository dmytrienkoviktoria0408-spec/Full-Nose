const cacheStrategies = {
  LRU: (cache) => {
    let oldest = Infinity;
    let keyToEvict = null;
    for (const [key, entry] of cache.entries()) {
      if (entry.lastAccessed < oldest) {
        oldest = entry.lastAccessed;
        keyToEvict = key;
      }
    }
    return keyToEvict;
  },
  LFU: (cache) => {
    let minUsage = Infinity;
    let keyToEvict = null;
    for (const [key, entry] of cache.entries()) {
      if (entry.count < minUsage) {
        minUsage = entry.count;
        keyToEvict = key;
      }
    }
    return keyToEvict;
  }
};

function memoize(fn, options = {}) {
  const cache = new Map();
  const limit = options.limit || Infinity;
  const strategy = options.strategy || "LRU";
  const ttl = options.ttl || null;

  return function (...args) {
    const key = JSON.stringify(args);
    const now = Date.now();

    if (cache.has(key)) {
      const entry = cache.get(key);
      
      if (ttl && (now - entry.createdAt > ttl)) {
        cache.delete(key);
      } else {
        entry.lastAccessed = now;
        entry.count++;
        console.log(`%c[Кеш ХІТ] Повернуто з кешу для: ${key}`, "color: #4CAF50; font-weight: bold;");
        return entry.value;
      }
    }

    const result = fn(...args);

    if (cache.size >= limit) {
      let evictKey = null;
      
      if (typeof strategy === "function") {
        evictKey = strategy(cache);
      } else if (cacheStrategies[strategy]) {
        evictKey = cacheStrategies[strategy](cache);
      }

      if (evictKey) {
        console.log(`%c[Кеш ВИДЕННЯ] Витіснено ключ згідно зі стратегією ${typeof strategy === 'function' ? 'Custom' : strategy}: ${evictKey}`, "color: #FF5722;");
        cache.delete(evictKey);
      }
    }

    cache.set(key, {
      value: result,
      lastAccessed: now,
      createdAt: now,
      count: 1,
    });

    console.log(`%c[Кеш МІС] Обчислено та додано в кеш для: ${key}`, "color: #2196F3;");
    return result;
  };
}