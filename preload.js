const { contextBridge, ipcRenderer } = require(`electron`);

contextBridge.exposeInMainWorld(`fileManager`, {
    openFile: () => ipcRenderer.send('openFile'),
    saveFile: (leftRack, middleRack, rightRack) => ipcRenderer.send('saveFile', {leftRack: leftRack, middleRack: middleRack, rightRack: rightRack})
});