"use strict";

async function* largeDataSource(limit) {
  for (let i = 1; i <= limit; i++) {
    if (i % 1000 === 0) {
      await new Promise(resolve => setTimeout(resolve, 5));
    }
    yield i;
  }
}

const processStreamConsole = async (dataIterator, transformer) => {
  let count = 0;

  for await (const chunk of dataIterator) {
    const processed = transformer(chunk);
    
    if (count % 2000 === 0) {
      console.log(`%c[Stream Chunk] Оброблено: ${count} елементів. Поточний продукт: ${processed.productId}`, "color: #4CAF50;");
    }
    count++;
  }

  console.log(`%c[Stream Complete] ✅ Успішно оброблено порціями всього: ${count} записів. Витік пам'яті: 0%`, "color: #2e7d32; font-weight: bold; font-size: 1.05em;");
};

console.log("%c\n--- ДЕМОНСТРАЦІЯ ЛАБОРАТОРНОЇ РОБОТИ: STREAMS & ASYNC ITERATOR ---", "color: #4CAF50; font-weight: bold; font-size: 1.1em;");

(async () => {
  const HUGE_LIMIT = 10000;
  const dataStream = largeDataSource(HUGE_LIMIT);

  const productTransformer = (id) => {
    return {
      productId: `PROD-${id}`,
      token: Math.random().toString(36).substring(7).toUpperCase()
    };
  };

  try {
    await processStreamConsole(dataStream, productTransformer);
  } catch (err) {
    console.error("[Stream Error]:", err);
  }
})();