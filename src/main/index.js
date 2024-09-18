import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'; // Añadimos ipcMain y dialog
import * as path from 'path';
import { electronApp, optimizer, is } from '@electron-toolkit/utils';
import fs from 'fs/promises';

const tempFolder = path.join(__dirname, '../temp'); // Carpeta temporal para guardar los archivos se une la el directorio actual con la carpeta temp

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 580,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux'
      ? {
          icon: path.join(__dirname, '../../build/icon.png')
        }
      : {}),
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  });

  mainWindow.on('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: 'deny' };
  });

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']);
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  }

  mainWindow.removeMenu();
  mainWindow.setResizable(false);
  mainWindow.setAlwaysOnTop(true, 'screen');

  mainWindow.webContents.openDevTools({ mode: 'detach' });
}

// Manejo de IPC para obtener la carpeta temporal
ipcMain.handle('get-temp-folder', () => tempFolder);

// Manejar el evento IPC para abrir el cuadro de diálogo de archivos
ipcMain.handle('dialog:openFile', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [{ name: 'Excel Files', extensions: ['xls', 'xlsx'] }]
  });
  return result.filePaths; // Retorna los paths completos de los archivos seleccionados
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron');

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  createWindow();

  try {
    await fs.mkdir(tempFolder, {recursive: true}); // Creamos la carpeta temporal
    console.log('Temp folder created at:', tempFolder);
  } catch (err) {
    console.error('Failed to create temp folder:', err);
  }

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });

  console.log('App is ready. Temp folder created at:', tempFolder);
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', async () => {
  if (process.platform !== 'darwin') {

    try {
      await fs.rm(tempFolder, {recursive: true}); // Eliminamos la carpeta temporal
      console.log('Temp folder removed');
    } catch (err) {
      console.error('Failed to remove temp folder:', err);
    }

    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
