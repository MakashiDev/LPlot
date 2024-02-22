const { app, BrowserWindow, ipcMain } = require(`electron`);
const fs = require('fs');
const path = require('path');

const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    });

    win.loadFile('index.html');
};

app.whenReady().then(() =>{
    createWindow();

    app.on('activate', () =>{
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () =>{
    if (process.platform !== 'darwin') app.quit();
});

ipcMain.on('openFile', (_event, message) =>{
    // Do Stuff to open the file with FS
});

ipcMain.on('saveFile', (_event, message) =>{
    // Get light data from message and save it to JSON
    const lights = [
        message.leftRack,
        message.middleRack,
        message.rightRack
    ];
});