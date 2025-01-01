const { app, BrowserWindow, ipcMain, Notification } = require('electron');
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

 // 알림 권한 요청 추가
 app.whenReady().then(() => {
   if (!Notification.isSupported()) {
     console.log('Notifications not supported');
     return;
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

 // IPC 리스너 설정
 ipcMain.on('show-notification', (event, { title, body }) => {
   const notification = new Notification({
     title,
     body,
     icon: path.join(__dirname, 'assets/icon.png'),
     silent: false, // Windows 기본 알림음 사용
     urgency: 'critical', // 알림 우선순위 높임
     timeoutType: 'never' // 알림이 자동으로 사라지지 않음
   });

   notification.show();

   // 알림 클릭 이벤트
   notification.on('click', () => {
     // 메인 윈도우 포커스
     const mainWindow = BrowserWindow.getAllWindows()[0];
     if (mainWindow) {
       if (mainWindow.isMinimized()) mainWindow.restore();
       mainWindow.focus();
     }
   });
 });

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
