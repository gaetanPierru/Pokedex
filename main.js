const { app, BrowserWindow, ipcMain } = require('electron')
const { autoUpdater } = require('electron-updater');
const path = require('path')
const sqlite = require('sqlite-electron')

let win

const createWindow = () => {
   win = new BrowserWindow({
    width: 800,
    height: 600,
    icon: __dirname + '/images/pokedex.icns',
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })
  win.loadFile('index.html')

  win.once('ready-to-show', () => {
    autoUpdater.checkForUpdatesAndNotify();
  })
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})



ipcMain.on('app_version', (event) => {
  event.sender.send('app_version', { version: app.getVersion() });
});

ipcMain.on('restart_app', () => {
  autoUpdater.quitAndInstall();
});

autoUpdater.on('update-available', () => {
  win.webContents.send('update_available');
});
autoUpdater.on('update-downloaded', () => {
  win.webContents.send('update_downloaded');
});

ipcMain.handle('createInMemoryDatabase', async() => {
  try {
    return await sqlite.setdbPath(':memory:')
  } catch (error) {
    return error
  }
})

ipcMain.handle("executeQuery", async (event, query, fetch, value) => {
  try {
    return await executeQuery(query, fetch, value);
  } catch (error) {
    return error;
  }
});

ipcMain.handle("executeMany", async (event, query, values) => {
  try {
    return await executeMany(query, values);
  } catch (error) {
    return error;
  }
});

ipcMain.handle('executeScript', async (event, scriptpath) => {
  try {
    return await sqlite.executeScript('CREATE TABLE IF NOT EXISTS pokedex (ID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,NOM TEXT NOT NULL,SHINY INTEGER NOT NULL DEFAULT 0, COMPTEUR INTEGER NOT NULL DEFAULT 0);');
  } catch (error) {
    return error
  }
})