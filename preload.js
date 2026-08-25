const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    saveStats: (stats) => ipcRenderer.send('save-stats', stats),
    loadStats: () => ipcRenderer.invoke('load-stats'),
    logAscent: (message) => ipcRenderer.send('log-ascent', message),
    checkDistractions: () => ipcRenderer.invoke('check-distractions'),
    openLogs: () => ipcRenderer.send('open-log-file')
});