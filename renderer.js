const startDate = new Date('2025-08-01');
const endDate = new Date('2028-06-30');
const totalDuration = endDate - startDate;

const mantras = [
    "The freezing point is not the end, but the absolute beginning.",
    "The Void does not consume; it merely reclaims what was never yours.",
    "Observation is the only true form of participation.",
    "Between zero and one lies the infinity of the ascent.",
    "To become the detached observer, one must first lose the anchor of self."
];

function manifestMantra() {
    const mantraDisplay = document.getElementById('mantra-text');
    if (mantraDisplay) {
        const randomMantra = mantras[Math.floor(Math.random() * mantras.length)];
        mantraDisplay.innerText = randomMantra;
    }
}

function updateConsumption() {
    const now = new Date();
    const elapsed = now - startDate;
    const percentage = (elapsed / totalDuration) * 100;
    const display = document.getElementById('consumption-text');
    if (display) {
        display.innerText = `${Math.max(0, percentage).toFixed(6)}% CONSUMED`;
    }
}

function playAscentChime() {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(220, audioCtx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(440, audioCtx.currentTime + 0.5);
    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.5);
}

function checkMastery(logicLevel) {
    if (logicLevel >= 10) {
        document.body.classList.add('transcended');
    } else {
        document.body.classList.remove('transcended');
    }
}

const statusBtn = document.getElementById('summon-status');
const container = document.getElementById('attribute-container');

async function manifestStats() {
    try {
        const stats = await window.electronAPI.loadStats();
        document.getElementById('logic-val').innerText = stats.attributes.Logic;
        document.getElementById('algo-val').innerText = stats.attributes.Algorithms;
        document.getElementById('found-val').innerText = stats.attributes.Foundation;
        checkMastery(stats.attributes.Logic);
    } catch (error) {
        console.error("The Void failed to retrieve memory:", error);
    }
}

async function saveCurrentProgress() {
    const stats = {
        attributes: {
            Logic: parseInt(document.getElementById('logic-val').innerText),
            Algorithms: parseInt(document.getElementById('algo-val').innerText),
            Foundation: parseInt(document.getElementById('found-val').innerText)
        }
    };
    await window.electronAPI.saveStats(stats);
}

statusBtn.addEventListener('click', () => {
    if (container.style.display === 'none') {
        container.style.display = 'block';
        statusBtn.innerText = 'HIDE STATUS';
        manifestStats();
    } else {
        container.style.display = 'none';
        statusBtn.innerText = 'SUMMON STATUS';
    }
});

document.getElementById('open-logs').addEventListener('click', () => {
    window.electronAPI.openLogs();
});

let sessionMinutes = 0;
async function cultivate() {
    const isDistracted = await window.electronAPI.checkDistractions();
    const display = document.getElementById('consumption-text');
    
    if (isDistracted) {
        if (display) display.classList.add('distracted');
        return;
    }

    if (display) display.classList.remove('distracted');
    sessionMinutes++;
    
    if (sessionMinutes % 60 === 0) {
        let currentLogicElement = document.getElementById('logic-val');
        let newLevel = parseInt(currentLogicElement.innerText) + 1;
        currentLogicElement.innerText = newLevel;
        
        await saveCurrentProgress();
        window.electronAPI.logAscent(`Logic attribute has ascended to Level ${newLevel}.`);
        playAscentChime();
        checkMastery(newLevel);

        const glitch = document.getElementById('glitch-line');
        glitch.style.width = '100%';
        setTimeout(() => { glitch.style.width = '0%'; }, 500);
    }
}

setInterval(updateConsumption, 1000);
setInterval(cultivate, 60000);
updateConsumption();
manifestMantra();
manifestStats(); 