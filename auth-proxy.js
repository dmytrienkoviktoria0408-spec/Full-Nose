"use strict";

const AuthStrategies = {
  apiKey: {
    name: "API Key Strategy",
    inject: (headers) => {
      headers["X-API-Key"] = "FN-SECURE-KEY-XYZ123";
    }
  },
  jwt: {
    name: "JWT Bearer Token Strategy",
    token: "initial.expired.token-abc",
    inject: function(headers) {
      headers["Authorization"] = `Bearer ${this.token}`;
    },
    renew: function() {
      this.token = "new.valid.jwt.token-999";
    }
  }
};

class AuthenticationProxy {
  constructor() {
    this.currentStrategy = "apiKey";
  }

  setStrategy(strategyName) {
    if (AuthStrategies[strategyName]) {
      this.currentStrategy = strategyName;
      console.log(`%c[Proxy System] Змінено стратегію на: ${AuthStrategies[strategyName].name}`, "color: #009688; font-weight: bold;");
    }
  }

  async request(url, options = {}) {
    if (!options.headers) options.headers = {};

    const strategy = AuthStrategies[this.currentStrategy];
    strategy.inject(options.headers);

    console.log(`%c[Proxy Request] Надіслано запит на ${url}`, "color: #007bff;");
    console.log("Заголовки запиту через проксі:", { ...options.headers });

    try {
      let response = await this._mockFetch(url, options);

      if (response.status === 401 && this.currentStrategy === "jwt") {
        console.warn("[Proxy Auth] ⚠️ Отримано статус 401 (Token Expired). Запуск автоматичного оновлення токена...");
        
        strategy.renew();
        strategy.inject(options.headers);
        
        console.log("%c[Proxy Auth] 🔄 Токен успішно оновлено! Повторний запит із новим токеном...", "color: #ff9800; font-weight: bold;");
        console.log("Нові заголовки запиту:", { ...options.headers });

        response = await this._mockFetch(url, options);
      }

      if (response.status === 200) {
        console.log("%c[Proxy Success] ✅ Запит успішно виконано! Статус: 200 OK", "color: #4CAF50; font-weight: bold;");
      }
      return response;

    } catch (error) {
      console.error("[Proxy Error] Помилка запиту:", error.message);
      throw error;
    }
  }

  _mockFetch(url, options) {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (this.currentStrategy === "jwt" && options.headers["Authorization"] === "Bearer initial.expired.token-abc") {
          resolve({ status: 401 });
        } else {
          resolve({ status: 200, data: { success: true } });
        }
      }, 500);
    });
  }
}

window.apiAuthProxy = new AuthenticationProxy();

console.log("%c\n--- ДЕМОНСТРАЦІЯ ЛАБОРАТОРНОЇ РОБОТИ: AUTH PROXY ---", "color: #9c27b0; font-weight: bold; font-size: 1.1em;");

(async () => {
  const testUrl = "https://api.external-lab.com/v1/check";

  window.apiAuthProxy.setStrategy("apiKey");
  await window.apiAuthProxy.request(testUrl);

  setTimeout(async () => {
    console.log("\n%c--- Зміна стратегії на JWT (симуляція протермінованого токена) ---", "color: #777; font-style: italic;");
    window.apiAuthProxy.setStrategy("jwt");
    await window.apiAuthProxy.request(testUrl);
  }, 1000);
})();