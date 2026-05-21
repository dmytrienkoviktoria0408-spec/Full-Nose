"use strict";

async function* largeDataSource(limit) {
  for (let i = 1; i <= limit; i++) {
    if (i % 500 === 0) {
      await new Promise(resolve => setTimeout(resolve, 10));
    }
    yield i;
  }
}

const processStreamUI = async (dataIterator, transformer, onProgress, onComplete) => {
  let count = 0;

  for await (const chunk of dataIterator) {
    const processed = transformer(chunk);
    
    if (count % 500 === 0) {
      onProgress(count, processed);
    }
    count++;
  }

  onComplete(count);
};