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
    const product = document.getElementById('productSearch').value.toLowerCase().trim();
    const resultDiv = document.getElementById('safetyResult');
    const treatSection = document.getElementById('treatSection');

    if (!petType || !product) {
        alert("Оберіть тварину та введіть продукт!");
        return;
    }

    if (window.safetyData && safetyData[petType] && safetyData[petType][product]) {
        const item = safetyData[petType][product];
        
        let color = "#e2e3e5";
        if (item.status === "safe") color = "#d4edda";
        if (item.status === "danger") color = "#f8d7da";
        if (item.status === "warning" || item.status === "caution") color = "#fff3cd";

        resultDiv.style.backgroundColor = color;
        resultDiv.innerHTML = `<strong>${product.toUpperCase()}:</strong> ${item.info}`;
        
        if (item.status === "safe") {
            treatSection.style.display = "block";
            updateTreatDisplay(petType);
        } else {
            treatSection.style.display = "none";
        }
    } else {
        resultDiv.style.backgroundColor = "#e2e3e5";
        resultDiv.innerHTML = `Дані про <b>${product}</b> для цієї тварини відсутні.`;
        treatSection.style.display = "none";
    }
    resultDiv.style.display = "block";
}

function giveTreat() {
    const petType = document.getElementById('petType').value;
    const now = new Date().getTime();
    const weekInMs = 7 * 24 * 60 * 60 * 1000;
    
    let treats = JSON.parse(localStorage.getItem('petTreats_' + petType)) || [];
    treats = treats.filter(date => (now - date) < weekInMs);
    
    const maxAllowed = (safetyData[petType] && safetyData[petType].maxTreatsPerWeek) || 5;

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
    const maxAllowed = (safetyData[petType] && safetyData[petType].maxTreatsPerWeek) || 5;

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
    const interval = safetyData[petType].bathInterval || 7;
    const bathType = safetyData[petType].bathType || "купання";

    const nextDate = new Date(lastDate);
    nextDate.setDate(lastDate.getDate() + interval);

    const infoBox = document.getElementById('nextBathInfo');
    infoBox.style.display = 'block';
    
    const options = { day: 'numeric', month: 'long' };
    const formattedDate = nextDate.toLocaleDateString('uk-UA', options);

    infoBox.innerHTML = 
        <p>✅ Дата збережена!</p>,
        <p>Вашому улюбленцю потрібна <b>${bathType}</b> кожні ${interval} днів.</p>,
        <p style="color: #d32f2f;">🕒 Наступна процедура: <b>${formattedDate}</b></p>
    ;
}