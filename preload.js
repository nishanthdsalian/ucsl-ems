const {contextBridge,ipcRenderer} = require('electron')

contextBridge.exposeInMainWorld('electronAPI',{
    'onErrorMsgReceived':(message)=>ipcRenderer.on('send-error',message),
    'onLogMsgReceived':(message)=>ipcRenderer.on('send-log',message),
    'sendMap':(map)=>ipcRenderer.send('login',map)
})