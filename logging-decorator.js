"use strict";

const LogLevels = {
  DEBUG: 1,
  INFO: 2,
  ERROR: 3
};

const LoggerConfig = {
  minLevel: "DEBUG",
  format: "JSON" 
};

function log(options = {}) {
  const level = options.level || "INFO";
  
  return function (targetFn) {
    
    return function (...args) {
      const startTime = performance.now();
      const timestamp = new Date().toISOString();
      const functionName = targetFn.name || "anonymous";

      const logEntry = {
        timestamp,
        level,
        functionName,
        arguments: args
      };

      const finalizeLog = (result, error = null) => {
        const executionTimeMs = (performance.now() - startTime).toFixed(2);
        logEntry.executionTime = `${executionTimeMs}ms`;

        if (error) {
          logEntry.level = "ERROR";
          logEntry.error = error.message || error;
        } else {
          logEntry.result = result;
        }

        if (LogLevels[logEntry.level] < LogLevels[LoggerConfig.minLevel]) {
          return;
        }

        if (LoggerConfig.format === "JSON") {
          const color = logEntry.level === "ERROR" ? "color: #ff4444;" : "color: #ffca28;";
          console.log(`%c[Log Decorator -> JSON Output]`, color, JSON.stringify(logEntry, null, 2));
        } else {
          console.log(`[${logEntry.timestamp}] [${logEntry.level}] Function ${logEntry.functionName} executed in ${logEntry.executionTime}. Args:`, logEntry.arguments, "Result:", logEntry.result || logEntry.error);
        }
      };

      try {
        const result = targetFn.apply(this, args);

        if (result instanceof Promise) {
          return result
            .then((resolvedValue) => {
              finalizeLog(resolvedValue);
              return resolvedValue;
            })
            .catch((err) => {
              finalizeLog(null, err);
              throw err;
            });
        }

        finalizeLog(result);
        return result;

      } catch (err) {
        finalizeLog(null, err);
        throw err;
      }
    };
  };
}

console.log("%c\n--- ДЕМОНСТРАЦІЯ ЛАБОРАТОРНОЇ РОБОТИ: LOGGING DECORATOR ---", "color: #e91e63; font-weight: bold; font-size: 1.1em;");

const calculateTax = log({ level: "INFO" })(function calculateTax(amount, percent) {
  return amount * (percent / 100);
});

const fetchLabStatus = log({ level: "DEBUG" })(function fetchLabStatus(labId) {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ id: labId, status: "completed" }), 400);
  });
});

const dangerOperation = log({ level: "ERROR" })(function dangerOperation(shouldFail) {
  if (shouldFail) {
    throw new Error("Критичний збій бази даних їжі!");
  }
  return "Все пройшло успішно (Логу не має бути)";
});

(async () => {
  calculateTax(5000, 20);

  await fetchLabStatus(103);

  dangerOperation(false);

  try {
    dangerOperation(true);
  } catch (e) {
  }
})();