import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'; // Añadimos ipcMain y dialog
import * as path from 'path';
import { electronApp, optimizer, is } from '@electron-toolkit/utils';
import fs from 'fs/promises';
import { exec, execFile } from 'child_process';

const tempFolder = path.join(app.getPath('temp'), 'temp-folder'); // Carpeta temporal para guardar los archivos se une la el directorio actual con la carpeta temp
const isPackaged = app.isPackaged;

const executablePath = isPackaged
  ? path.join(process.resourcesPath, 'executables', 'Comparacion_SIIA_CH_Lite.exe') // Ruta empaquetada
  : path.resolve(__dirname, '../../src/renderer/src/executables/Comparacion_SIIA_CH_Lite.exe'); // Ruta en desarrollo


const roundedIconPath = isPackaged
  ? path.join(process.resourcesPath, 'images', 'roundedicon.ico')
  : path.resolve(__dirname, '../../src/renderer/src/images/roundedicon.ico');

console.log('Executable path:', executablePath);

let errorScript = false;
let comparisonProcess = null;

let mainWindow;
let pdfWindow;

//funcion para crear el folder temporal
async function createTempFolder(tempFolder) {
  try {
    const folderExists = await fs.access(tempFolder).then(() => true).catch(() => false);

    if(folderExists){
      console.log('Temp folder already exists, deleting contents...');
      await clearFolder(tempFolder);
    }

    await fs.mkdir(tempFolder, {recursive: true});
    console.log('Temp folder created at:', tempFolder);

    exec('attrib +h ' + tempFolder, function(err, stdout, stderr) {
      if (err) {
        console.error('Failed to hide temp folder:', err);
      } else {
        console.log('Temp folder hidden');
      }
    });
  } catch (error) {
    console.error('Failed to create temp folder:', error);
  }
}

//funcion para eliminar el folder temporal
async function clearFolder(tempFolder) {
  try {
    await fs.rm(tempFolder, {recursive: true}); // Eliminamos la carpeta temporal
    console.log('Temp folder removed');
  } catch (err) {
    console.error('Failed to remove temp folder:', err);
  }
}

//funcion para crear la ventana
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 740,
    height: 510,
    show: false,
    title: 'Comparador CD',
    icon: roundedIconPath,
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
    mainWindow.setAlwaysOnTop(true, 'screen');
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  }

  mainWindow.removeMenu();
  mainWindow.setResizable(false);

  mainWindow.on('closed', () => {
    if (pdfWindow) {
      pdfWindow.close();
    }
    mainWindow = null;
  });
}

//Obtener la carpeta temporal
ipcMain.handle('get-temp-folder', () => tempFolder);

//Obtener la ruta del ejecutable
ipcMain.handle('get-executable-path', () => executablePath);

// Manejar el evento IPC para abrir el cuadro de diálogo de archivos
ipcMain.handle('dialog:openFile', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [{ name: 'Excel Files', extensions: ['xls', 'xlsx'] }]
  });
  return result.filePaths; // Retorna los paths completos de los archivos seleccionados
});

// Manejar el evento IPC para ejecutar la comparación de archivos
ipcMain.handle('execute-compare-files', async (event, file1, file2, tempFolder) => {
  errorScript = false;

  comparisonProcess = execFile(executablePath, [file1, file2, tempFolder], async (err, data) => {
    if (err) {

      if (comparisonProcess === null) {
        console.log('Comparison process was killed.');
        return;
      }

      errorScript = true;
      event.sender.send('error-script', errorScript);
      console.error(err);
      return;
    }

    console.log(data.toString());

    try {
      const comparisonFilePath = path.join(tempFolder, 'comparison.xlsx');
      await fs.access(comparisonFilePath);
      event.sender.send('comparison-file-created', comparisonFilePath);
    } catch (err) {
      console.error('Comparison file not found:', err);
      event.sender.send('error-script', true);
    }
  });
});

// Manejar el evento de cancelacion de la comparación
ipcMain.on('cancel-comparison', (event) => {
  if (comparisonProcess) {
    comparisonProcess.kill();
    comparisonProcess = null;
    event.sender.send('comparison-cancelled', true);
    console.log('Comparison process cancelled.');
  } else {
    event.sender.send('comparison-cancelled', false);
    console.log('No comparison process to cancel.');
  }
});


ipcMain.handle('save-comparison-file', async (event, comparisonFilePath) => {
  const result = await dialog.showSaveDialog({
    title: 'Save Comparison File',
    defaultPath: 'comparison.xlsx',
    filters: [{ name: 'Excel Files', extensions: ['xlsx'] }]
  });
  if (!result.canceled && result.filePath) {
    try {
      await fs.copyFile(comparisonFilePath, result.filePath);
      console.log('File saved to:', result.filePath);
    } catch (error) {
      console.error('Failed to save file:', error);
    }
  }
});

// Manejar el evento IPC para obtener el tamaño de un archivo
ipcMain.handle('get-file-size', async (event, filePath) => {
  try {
    const stats = await fs.stat(filePath);
    return (stats.size / 1024).toFixed(2) + ' KB'; // Convert size to KB and format
  } catch (error) {
    console.error('Failed to get file size:', error);
    throw error;
  }
});

// Manejar el evento IPC para limpiar los archivos cargados
ipcMain.handle('clear-loaded-files', async () => {
  try {
    const files = await fs.readdir(tempFolder);
    for (const file of files) {
      await fs.unlink(path.join(tempFolder, file));
    }
    console.log('All loaded files have been cleared.');
  } catch (err) {
    console.error('Failed to clear loaded files:', err);
  }
});

// Evento para abrir el PDF
ipcMain.on('open-user-guide', () => {
  try {
    if (!pdfWindow) {
      pdfWindow = new BrowserWindow({
        width: 800,
        height: 600,
        show: false,
        icon: roundedIconPath,
        title: 'Guía de Usuario',
        webPreferences: {
          nodeIntegration: false,
          contextIsolation: true,
        },
    });
  
    const pdfPath = isPackaged
      ? path.join(process.resourcesPath, 'documents', 'Guia De Usuario.pdf')
      : path.resolve(__dirname, '../../src/renderer/src/documents/Guia De Usuario.pdf');

    pdfWindow.on('ready-to-show', () => {
      pdfWindow.show();
    });

    pdfWindow.on('page-title-updated', (e) => {
      e.preventDefault();
    });

    pdfWindow.removeMenu();
    pdfWindow.loadFile(pdfPath);

    pdfWindow.on('closed', () => {
      pdfWindow = null;
    });
  }
  } catch (error) {
    console.error('Failed to open user guide:', error);
  }
});


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
  createTempFolder(tempFolder);

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

    await clearFolder(tempFolder);
    app.quit();
  }
});
