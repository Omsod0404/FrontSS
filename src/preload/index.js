import { contextBridge, ipcRenderer } from 'electron'; // Añadimos ipcRenderer para comunicación IPC
import { electronAPI } from '@electron-toolkit/preload';

// Exponemos la función para abrir el diálogo de selección de archivos
contextBridge.exposeInMainWorld('electronAPI', {
  openFileDialog: () => ipcRenderer.invoke('dialog:openFile') // Aquí invocamos el evento para abrir el diálogo
});

// Custom APIs for renderer
const api = {
  getTempFolder: () => ipcRenderer.invoke('get-temp-folder'), // Obtener el directorio temporal
  executeCompareFiles: (file1, file2, tempFolder) => {
    ipcRenderer.invoke('execute-compare-files', file1, file2, tempFolder);
  },
  saveComparisonFile: (comparisonFilePath) => {
    ipcRenderer.invoke('save-comparison-file', comparisonFilePath);
  }
};

// Usamos `contextBridge` solo si el contexto está aislado
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI);
    contextBridge.exposeInMainWorld('api', api);
  } catch (error) {
    console.error(error);
  }
} else {
  window.electron = electronAPI;
  window.api = api;
}

ipcRenderer.on('error-script', (_, error) => {
  window.dispatchEvent(new CustomEvent('error-script', { detail: error }));
});

ipcRenderer.on('comparison-file-created', (_, filePath) => {
  window.dispatchEvent(new CustomEvent('comparison-file-created', { detail: filePath }));
});
