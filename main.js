const { app, BrowserWindow } = require('electron');
const path = require('path');
require('electron-reload')(__dirname, {
 electron: path.join(__dirname, 'node_modules', '.bin', 'electron')
});

function createWindow() {
 const win = new BrowserWindow({
   width: 800,
   height: 600,
   webPreferences: {
     nodeIntegration: true,
     contextIsolation: false,
     webSecurity: true
   }
 });

 // CSP 헤더 설정
 win.webContents.session.webRequest.onHeadersReceived((details, callback) => {
   callback({
     responseHeaders: {
       ...details.responseHeaders,
       'Content-Security-Policy': [
       "default-src 'self'; " +
       "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
       "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; " +
       "font-src 'self' https://cdn.jsdelivr.net; " +
       "connect-src 'self' https://api.upbit.com wss://api.upbit.com"
     ]
     }
   });
 });

 // 메뉴바 제거
 win.removeMenu();

 win.webContents.openDevTools();

 win.loadFile('src/index.html');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
 if (process.platform !== 'darwin') {
   app.quit();
 }
});

app.on('activate', () => {
 if (BrowserWindow.getAllWindows().length === 0) {
   createWindow();
 }
});