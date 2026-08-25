const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 400,
        height: 600,
        frame: false,
        transparent: true,
        alwaysOnTop: true,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true
        }
    });

    mainWindow.loadFile('index.html');
}

app.whenReady().then(createWindow);

ipcMain.handle('load-stats', async () => {
    const statsPath = path.join(__dirname, 'stats.json');
    if (!fs.existsSync(statsPath)) {
        const initialStats = { attributes: { Logic: 0, Algorithms: 0, Foundation: 0 } };
        fs.writeFileSync(statsPath, JSON.stringify(initialStats, null, 2));
    }
    const data = fs.readFileSync(statsPath, 'utf8');
    return JSON.parse(data);
});

ipcMain.on('save-stats', (event, stats) => {
    const statsPath = path.join(__dirname, 'stats.json');
    fs.writeFileSync(statsPath, JSON.stringify(stats, null, 2));
});

ipcMain.on('log-ascent', (event, message) => {
    const logPath = path.join(__dirname, 'cultivation.log');
    const timestamp = new Date().toLocaleString();
    const entry = `[${timestamp}] ${message}\n`;
    fs.appendFileSync(logPath, entry);
});

ipcMain.handle('check-distractions', async () => {
    return new Promise((resolve) => {
        const forbidden = ['chrome.exe', 'discord.exe', 'spotify.exe', 'steam.exe'];
        exec('tasklist', (err, stdout) => {
            const isDistracted = forbidden.some(app => stdout.toLowerCase().includes(app));
            resolve(isDistracted);
        });
    });
});

ipcMain.on('open-log-file', () => {
    const logPath = path.join(__dirname, 'cultivation.log');
    if (fs.existsSync(logPath)) {
        shell.openPath(logPath);
    }
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});