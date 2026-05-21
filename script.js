function calculateDiet() {
    const type = document.getElementById('petType').value;
    const weight = document.getElementById('petWeight').value;
    const resBox = document.getElementById('results');
    
    if (!type) {
        alert("Будь ласка, оберіть тварину зі списку!");
        return;
    }

    if (!weight || weight <= 0) {
        alert("Будь ласка, введіть коректну вагу (більше 0)!");
        return;
    }

    let foodPercent = 0;
    let advice = "";

    switch(type) {
        // гризуни
        case 'degu': foodPercent = 0.05; advice = "Уникайте цукру! Основа раціону — сіно та спеціальний корм."; break;
        case 'hamster': foodPercent = 0.10; advice = "Люблять робити запаси. Не перегодовуйте соковитими кормами."; break;
        case 'guinea_pig': foodPercent = 0.06; advice = "Обов'язково додавайте продукти з вітаміном С, вони його не виробляють."; break;
        case 'chinchilla': foodPercent = 0.05; advice = "Тільки сухий корм і сіно. Свіжі овочі можуть зашкодити травленню."; break;
        case 'rabbit': foodPercent = 0.05; advice = "80% раціону — свіже сіно. Овочі лише як додаток."; break;
        case 'rat': foodPercent = 0.07; advice = "Всеїдні, але уникайте солоного, смаженого та шоколаду."; break;

        // ссавці
        case 'cat': foodPercent = 0.05; advice = "Розділіть на 2-3 прийоми їжі. Використовуйте якісний білковий корм."; break;
        case 'dog': foodPercent = 0.03; advice = "Норма залежить від активності. Не забувайте про режим прогулянок."; break;
        case 'ferret': foodPercent = 0.06; advice = "Потребують багато тваринного білка. Мають дуже швидкий метаболізм."; break;
        case 'hedgehog': foodPercent = 0.08; advice = "Основа — спеціальний корм або комахи. Не давайте молоко!"; break;
        case 'sugar_glider': foodPercent = 0.15; advice = "Потребують суміші фруктів, овочів та білкової їжі (акацієва камедь)."; break;

        // птахи
        case 'parrot': foodPercent = 0.12; advice = "Крім зерна, давайте свіжі фрукти та гілочки фруктових дерев."; break;
        case 'canary': foodPercent = 0.15; advice = "Дуже чутливі до якості зерносуміші та чистої води."; break;
        case 'finch': foodPercent = 0.15; advice = "Маленькі пташки, які їдять часто. Завжди тримайте годівничку повною."; break;
        case 'pigeon': foodPercent = 0.10; advice = "Потребують суміші різних злаків та мінеральної підкормки (галька)."; break;

        // рептилії та амфібії
        case 'turtle': foodPercent = 0.03; advice = "Для водних — риба та нежирне м'ясо, для сухопутних — зелень."; break;
        case 'lizard': foodPercent = 0.05; advice = "Більшість потребує живих комах та кальцієвих добавок."; break;
        case 'snake': foodPercent = 0.10; advice = "Харчуються рідко (раз на 1-2 тижні). Вага порції залежить від віку."; break;
        case 'axolotl': foodPercent = 0.05; advice = "Їдять мотиль або спеціальні гранули. Стежте за температурою води!"; break;
        case 'frog': foodPercent = 0.08; advice = "Харчуються переважно живими комахами."; break;

        // риби та інші
        case 'goldfish': foodPercent = 0.02; advice = "Краще недогодувати, ніж перегодовуйте. Схильні до ожиріння."; break;
        case 'betta': foodPercent = 0.03; advice = "Давайте стільки, скільки з'їдає за 2 хвилини. Люблять білкову їжу."; break;
        case 'guppy': foodPercent = 0.03; advice = "Їдять потроху, але часто. Підходять універсальні пластівці."; break;
        case 'shrimp': foodPercent = 0.01; advice = "Харчуються водоростями та залишками корму. Не переборщіть!"; break;
        case 'snail': foodPercent = 0.05; advice = "Потребують багато кальцію (сепія) для міцності панцира."; break;

        // екзотика
        case 'tarantula': foodPercent = 0.05; advice = "Їдять раз на тиждень. Слідкуйте, щоб у тераріумі не лишалося комах."; break;
        case 'stick_insect': foodPercent = 0.20; advice = "Головне — свіже листя (малина, ожина, дуб) щодня."; break;
        case 'ant_farm': foodPercent = 0.01; advice = "Залежить від розміру колонії. Потрібен зерновий корм або сироп."; break;

        default: foodPercent = 0.04; advice = "Зверніться до фахівця для підбору дієти.";
    }

    const amount = (weight * foodPercent).toFixed(1);
    
    document.getElementById('foodAmount').innerHTML = `<b>Денна норма їжі:</b> приблизно ${amount} г.`;
    document.getElementById('vetTips').innerText = "Порада: " + advice;
    resBox.style.display = 'block';
}

function checkSafety() {
    const petType = document.getElementById('petType').value;
    const foodInput = document.getElementById('productSearch').value.trim();
    const resultBox = document.getElementById('safetyResult');

    if (!petType || !foodInput) {
        alert("Оберіть тварину та введіть назву продукту!");
        return;
    }

    const petData = window.safetyData[petType];
    
    if (!petData || !petData.products) {
        alert("Дані про цю тварину ще не завантажені або файл відсутній.");
        return;
    }

    const options = {
        keys: ['name'],
        threshold: 0.4
    };

    const fuse = new Fuse(petData.products, options);
    const results = fuse.search(foodInput);

    resultBox.style.display = 'block';

    if (results.length > 0) {
        const foodInfo = results[0].item;
        
        const statusColors = {
            'safe': '#d4edda',
            'danger': '#f8d7da',
            'caution': '#fff3cd',
            'warning': '#fff3cd'
        };

        resultBox.style.backgroundColor = statusColors[foodInfo.status] || '#e2e3e5';
        
        resultBox.innerHTML = `<strong>${foodInfo.name.toUpperCase()}:</strong> ${foodInfo.info}`;
    } else {
        resultBox.style.backgroundColor = "#e2e3e5";
        resultBox.innerHTML = "На жаль, інформації про цей продукт немає в базі для цієї тварини.";
    }
}

function giveTreat() {
    const petType = document.getElementById('petType').value;
    const now = new Date().getTime();
    const weekInMs = 7 * 24 * 60 * 60 * 1000;
    
    let treats = JSON.parse(localStorage.getItem('petTreats_' + petType)) || [];
    treats = treats.filter(date => (now - date) < weekInMs);
    
    const maxAllowed = (window.safetyData[petType] && window.safetyData[petType].maxTreatsPerWeek) || 5;

    if (treats.length >= maxAllowed) {
        alert("СТОП! На цей тиждень ліміт смаколиків для цієї тварини вичерпано.");
        return;
    }
    
    treats.push(now);
    localStorage.setItem('petTreats_' + petType, JSON.stringify(treats));
    updateTreatDisplay(petType);
}

function updateTreatDisplay(petType) {
    const treatCountText = document.getElementById('treatCount');
    const giveTreatBtn = document.querySelector('#treatSection button');
    const now = new Date().getTime();
    const weekInMs = 7 * 24 * 60 * 60 * 1000;

    let treats = JSON.parse(localStorage.getItem('petTreats_' + petType)) || [];
    const recentTreats = treats.filter(date => (now - date) < weekInMs);
    
    const count = recentTreats.length;
    const maxAllowed = (window.safetyData[petType] && window.safetyData[petType].maxTreatsPerWeek) || 5;

    if (treatCountText) {
        treatCountText.innerHTML = `Використано смаколиків: <b>${count} з ${maxAllowed}</b> на цьому тижні.`;
    }
    
    if (giveTreatBtn) {
        if (count >= maxAllowed) {
            giveTreatBtn.style.backgroundColor = "#ccc";
            giveTreatBtn.innerText = "Ліміт вичерпано";
            giveTreatBtn.disabled = true;
        } else {
            giveTreatBtn.style.backgroundColor = "#4CAF50";
            giveTreatBtn.innerText = "🍭 Дати смаколик";
            giveTreatBtn.disabled = false;
        }
    }
}

function goToWeightStep() {
    const type = document.getElementById('petType').value;
    if (type === "") {
        alert("Будь ласка, спочатку оберіть тваринку!");
        return;
    }
    document.getElementById('navigationStep1').style.display = 'none';
    document.getElementById('setupStep').style.display = 'block';
}

function goBackToPetSelection() {
    document.getElementById('setupStep').style.display = 'none';
    document.getElementById('navigationStep1').style.display = 'block';
    document.getElementById('results').style.display = 'none';
    document.getElementById('safetyResult').style.display = 'none';
    document.getElementById('treatSection').style.display = 'none';
}

function saveBathDate() {
    const petType = document.getElementById('petType').value;
    const lastDateValue = document.getElementById('lastBathDate').value;
    
    if (!lastDateValue) {
        alert("Оберіть дату!");
        return;
    }

    const lastDate = new Date(lastDateValue);
    const interval = window.safetyData[petType]?.bathInterval || 7;
    const bathType = window.safetyData[petType]?.bathType || "купання";

    const nextDate = new Date(lastDate);
    nextDate.setDate(lastDate.getDate() + interval);

    const infoBox = document.getElementById('nextBathInfo');
    infoBox.style.display = 'block';
    
    const options = { day: 'numeric', month: 'long' };
    const formattedDate = nextDate.toLocaleDateString('uk-UA', options);

    infoBox.innerHTML = `
        <p>✅ Дата збережена!</p>
        <p>Вашому улюбленцю потрібна <b>${bathType}</b> кожні ${interval} днів.</p>
        <p style="color: #d32f2f;">🕒 Наступна процедура: <b>${formattedDate}</b></p>
    `;
}
function* colorCycleGenerator(colors = ["#f44336", "#4caf50", "#2196f3", "#ffeb3b", "#9c27b0"]) {
    let index = 0;
    while (true) {
        yield colors[index];
        index = (index + 1) % colors.length;
    }
}

async function consumeWithTimeoutUI(iterator, seconds, outputElement) {
    const timeoutMs = seconds * 1000;
    const startTime = Date.now();
    let count = 1;

    outputElement.style.display = 'block';
    outputElement.innerHTML = "⏳ Розпочато виконання...";
    outputElement.style.backgroundColor = "#ffffff";
    outputElement.style.color = "#000000";

    while (Date.now() - startTime < timeoutMs) {
        const { value } = iterator.next();
        
        const currentTime = new Date().toLocaleTimeString('uk-UA');

        outputElement.style.backgroundColor = value;
        outputElement.style.color = (value === "#ffeb3b") ? "#000" : "#fff"; 
        outputElement.innerHTML = `🌈 Ітерація №${count}<br>Значення (колір): ${value}<br>Час: ${currentTime}`;

        count++;
        
        await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    outputElement.style.backgroundColor = "#e0e0e0";
    outputElement.style.color = "#333";
    outputElement.innerHTML = `🏁 Час вичерпано (${seconds} сек).<br>Всього генерацій: ${count - 1}. Роботу завершено!`;
}

function startLabTimer() {
    const timeoutInput = document.getElementById('labTimeout').value;
    const seconds = parseInt(timeoutInput) || 5;
    const outputElement = document.getElementById('labOutput');

    const colors = ["#f44336", "#4caf50", "#2196f3", "#9c27b0", "#ff9800"];
    
    const myGenerator = colorCycleGenerator(colors);
    
    consumeWithTimeoutUI(myGenerator, seconds, outputElement);
}
function coreSearchProduct(petType, productName) {
    if (!window.safetyData || !window.safetyData[petType]) return null;
    
    const products = window.safetyData[petType].products;
    return products.find(p => p.name.toLowerCase() === productName.toLowerCase()) || null;
}

const memoizedSearchProduct = memoize(coreSearchProduct, {
    limit: 3,
    strategy: "LRU",
    ttl: 30000
});

function checkProductSafety() {
    const petType = document.getElementById('petType').value;
    const productName = document.getElementById('productNameInput').value.trim();
    const resBox = document.getElementById('results');
    
    if (!petType) {
        alert("Будь ласка, оберіть вашу тваринку у списку вище!");
        return;
    }

    if (!productName) {
        alert("Будь ласка, введіть назву продукту для перевірки!");
        return;
    }

    const result = memoizedSearchProduct(petType, productName);
    
    resBox.style.display = 'block';
    
    if (result) {
        let statusBadge = "";
        if (result.status === "safe") statusBadge = "<span style='color: green;'>🍏 Безпечно</span>";
        else if (result.status === "danger") statusBadge = "<span style='color: red;'>❌ Смертельно небезпечно!</span>";
        else if (result.status === "caution" || result.status === "warning") statusBadge = "<span style='color: orange;'>⚠️ Обережно</span>";
        else statusBadge = result.status;

        resBox.innerHTML = `
            <h3>Результат експрес-пошуку:</h3>
            <p><strong>Продукт:</strong> ${result.name}</p>
            <p><strong>Статус:</strong> ${statusBadge}</p>
            <p><strong>Аналітика:</strong> ${result.info}</p>
            <div style="font-size: 0.8em; color: #666; margin-top: 10px; border-top: 1px solid #ccc; padding-top: 5px;">
                * Стан кешування та витіснення елементів дивіться у вкладці "Console" (F12)
            </div>
        `;
    if (result && window.notificationQueue) {
    let priority = 10;
    
        if (result.status === "danger") {
           priority = 100;
        } else if (result.status === "caution" || result.status === "warning") {
            priority = 50;
        }

        const queueItem = {
            pet: petType,
            product: result.name,
            status: result.status,
            info: result.info
        };

        window.notificationQueue.enqueue(queueItem, priority);
    
        const qCountEl = document.getElementById('queueCount');
        if (qCountEl) {
            qCountEl.innerText = window.notificationQueue.elements.length;
        }
    }
    } else {
        resBox.innerHTML = `
            <h3>Результат експрес-пошуку:</h3>
            <p style="color: #555;">Продукт "<strong>${productName}</strong>" відсутній у базі для обраного типу тварини.</p>
        `;
    }
}
function handleQueueAction(action, type) {
    if (!window.notificationQueue) return;

    const resBox = document.getElementById('queueResult');
    const qCountEl = document.getElementById('queueCount');
    
    let item = null;
    let actionText = action === 'peek' ? '👀 Підглянуто' : '📥 Вилучено';

    if (action === 'peek') {
        item = window.notificationQueue.peek(type);
    } else {
        item = window.notificationQueue.dequeue(type);
    }

    if (qCountEl) {
        qCountEl.innerText = window.notificationQueue.elements.length;
    }

    if (!item) {
        resBox.innerHTML = `<span style="color: #777;">Черга порожня для критерію "${type}"</span>`;
        return;
    }

    let statusEmoji = "🍏";
    if (item.status === "danger") statusEmoji = "❌ Смертельно!";
    else if (item.status === "warning" || item.status === "caution") statusEmoji = "⚠️ Обережно";

    resBox.innerHTML = `
        <strong>${actionText} (${type}):</strong><br>
        🐾 Тварина: <code>${item.pet}</code> | 🥑 Продукт: <strong>${item.product}</strong><br>
        Статус: ${statusEmoji} | <small>${item.info}</small>
    `;
}