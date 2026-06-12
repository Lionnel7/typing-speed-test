// Liste des phrases pour le test
const phrases = [
    "Le developpement web demande de la rigueur et de la patience au quotidien.",
    "Les reseaux informatiques connectent les utilisateurs a travers le monde entier.",
    "La cybersécurité est devenue un enjeu majeur pour toutes les entreprises.",
    "Manipuler le DOM en JavaScript permet de creer des interfaces interactives.",
    "Un bon code est un code simple, lisible et facilement maintenable."
];

// Recupere les elements du DOM
const textDisplay = document.getElementById('text-display');
const textInput = document.getElementById('text-input');
const timerEl = document.getElementById('timer');
const wpmEl = document.getElementById('live-wpm');
const resultScreen = document.getElementById('result-screen');
const restartBtn = document.getElementById('restart-btn');

const finalWpm = document.getElementById('final-wpm');
const finalAccuracy = document.getElementById('final-accuracy');
const finalTime = document.getElementById('final-time');
const closeResultBtn = document.getElementById('close-result-btn');

// Variables globales
let chrono = 0;
let intervalId = null;
let running = false;
let index = 0;
let totalFrappes = 0;

// Setup de la partie et generation du texte
function init() {
    chrono = 0;
    running = false;
    index = 0;
    totalFrappes = 0;
    timerEl.textContent = "0s";
    wpmEl.textContent = "0";
    clearInterval(intervalId);
    
    textInput.value = "";
    textDisplay.innerHTML = "";
    resultScreen.classList.add('hidden');
    
    // Prend une phrase au hasard
    const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
    
    // Decoupe la phrase en spans
    randomPhrase.split('').forEach((char, i) => {
        const span = document.createElement('span');
        span.textContent = char;
        if (i === 0) span.classList.add('current');
        textDisplay.appendChild(span);
    });

    textInput.focus();
}

// Lance le timer
function startTimer() {
    intervalId = setInterval(() => {
        chrono++;
        timerEl.textContent = chrono + "s";
        
        // WPM en temps reel
        const spans = textDisplay.querySelectorAll('span');
        let corrects = 0;
        for (let i = 0; i < index; i++) {
            if (spans[i].classList.contains('correct')) corrects++;
        }
        
        if (chrono > 0) {
            let wpm = Math.round((corrects / 5) / (chrono / 60));
            wpmEl.textContent = wpm;
        }
    }, 1000);
}

// Arret de la partie et calculs des scores
function finPartie() {
    clearInterval(intervalId);
    
    const spans = textDisplay.querySelectorAll('span');
    let corrects = 0;
    
    spans.forEach(span => {
        if (span.classList.contains('correct')) corrects++;
    });

    let tempsMinutes = chrono / 60;
    if (tempsMinutes === 0) tempsMinutes = 1 / 60;
    
    let wpm = Math.round((corrects / 5) / tempsMinutes);
    let precision = totalFrappes > 0 ? Math.round((corrects / totalFrappes) * 100) : 0;

    finalWpm.textContent = wpm;
    finalAccuracy.textContent = precision;
    finalTime.textContent = chrono;
    
    resultScreen.classList.remove('hidden');
}

// Écoute de la saisie utilisateur
textInput.addEventListener('input', (e) => {
    const spans = textDisplay.querySelectorAll('span');
    const inputVal = textInput.value;
    const inputChars = inputVal.split('');

    if (e.inputType !== 'deleteContentBackward') {
        totalFrappes++;
    }

    if (!running && inputVal.length > 0) {
        running = true;
        startTimer();
    }

    index = inputChars.length;

    spans.forEach((span, i) => {
        span.classList.remove('current');

        if (i < index) {
            if (inputChars[i] === span.textContent) {
                span.classList.add('correct');
                span.classList.remove('incorrect');
            } else {
                span.classList.add('incorrect');
                span.classList.remove('correct');
            }
        } else {
            span.classList.remove('correct', 'incorrect');
        }
    });

    if (index < spans.length) {
        spans[index].classList.add('current');
    } else {
        finPartie();
    }
});

// Event listeners de l'interface
restartBtn.addEventListener('click', init);
closeResultBtn.addEventListener('click', () => {
    resultScreen.classList.add('hidden');
});

textDisplay.addEventListener('click', () => {
    textInput.focus();
});

// Init au chargement
init();
