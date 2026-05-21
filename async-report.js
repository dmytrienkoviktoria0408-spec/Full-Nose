"use strict";

const mapAsync = (array, callback, finalDone) => {
  const result = [];
  let completed = 0;

  if (array.length === 0) return finalDone(null, []);

  array.forEach((item, index) => {
    callback(item, (err, mappedValue) => {
      if (err) return finalDone(err);
      
      result[index] = mappedValue;
      completed++;

      if (completed === array.length) {
        finalDone(null, result);
      }
    });
  });
};

const mapPromise = (array, fn, options = {}) => {
  const { signal } = options;

  return new Promise((resolve, reject) => {
    if (signal?.aborted) return reject(new Error("Процес скасовано користувачем"));

    const promises = array.map(async (item) => {
      if (signal?.aborted) throw new Error("Процес скасовано користувачем");
      return await fn(item);
    });

    signal?.addEventListener("abort", () => reject(new Error("Процес скасовано користувачем")));

    Promise.all(promises).then(resolve).catch(reject);
  });
};

let reportAbortController = null;

const asyncCheckProduct = (productName, petType) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const result = memoizedSearchProduct ? memoizedSearchProduct(petType, productName.trim().toLowerCase()) : null;
      resolve({ name: productName.trim(), result });
    }, 800); 
  });
};