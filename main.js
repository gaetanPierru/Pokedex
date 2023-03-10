const { app, BrowserWindow, ipcMain, Notification } = require('electron')
const { autoUpdater } = require('electron-updater');
const path = require('path')
const sqlite3 = require('sqlite3').verbose();

let win //                         ./db.sqlite3    :memory:
const database = new sqlite3.Database('./db.sqlite3', (err) => {
  if (err) console.error('Database opening error: ', err);
  // console.log('Connected to the in-memory sqlite db')
});

database.run("CREATE TABLE IF NOT EXISTS pokedex (id	INTEGER NOT NULL,PokemonId	INTEGER NOT NULL,Shiny	INTEGER NOT NULL DEFAULT 0,Compteur	INTEGER NOT NULL DEFAULT 0,PRIMARY KEY(id AUTOINCREMENT))");

console.log(Notification.isSupported())

const createWindow = () => {
  win = new BrowserWindow({
    icon: __dirname + '/images/icon.ico',
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })
  win.maximize()
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

  const NOTIFICATION_TITLE = 'Bienvenue'
  const NOTIFICATION_BODY = 'Application ouverte'
  const a = new Notification({title: NOTIFICATION_TITLE, body: NOTIFICATION_BODY})
  a.show()
  console.log(a);
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})



ipcMain.on('shiny', (event, pkmn, compteur) => {
  database.run("INSERT INTO pokedex(PokemonId, Shiny, Compteur) VALUES(?, ?, ?)", [pkmn, 1, compteur], (err, rows) => {
    if (err) {
      throw err;
    }
    event.sender.send('shiny');
  })
});

ipcMain.on('pokedex', (event) => {
  database.all("SELECT * FROM pokedex where Shiny=1", [], (err, rows) => {
    if (err) {
      throw err;
    }
    // console.log(rows);
    event.sender.send('pokedex', rows);
  })
});

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
