import { contextBridge, ipcRenderer } from "electron";
import { electronAPI } from "@electron-toolkit/preload";

// Exponemos la función para abrir el diálogo de selección de archivos
contextBridge.exposeInMainWorld('electronAPI', {
  openFileDialog: () => ipcRenderer.invoke('dialog:openFile') // Aquí invocamos el evento para abrir el diálogo
});

//API personalzada
const api = {

  //Obtener el directorio temporal
  getTempFolder: () => ipcRenderer.invoke('get-temp-folder'),

  //Obtener el ejecutable
  getExecutablePath: () => ipcRenderer.invoke('get-executable-path'),

  //Ejecutar el script de comparación
  executeCompareFiles: (file1, file2, tempFolder) => {
    return ipcRenderer.invoke('execute-compare-files', file1, file2, tempFolder);
  },

  // Guardar el archivo de comparación
  saveComparisonFile: (comparisonFilePath) => {
    return ipcRenderer.invoke('save-comparison-file', comparisonFilePath);
  },

  //Limpiar archivos cargados
  clearLoadedFiles: () => ipcRenderer.invoke('clear-loaded-files'),

  //Cancelar la comparación
  cancelComparison: () => {
    ipcRenderer.send('cancel-comparison');
  }
}

//Exponer los eventos
ipcRenderer.on('error-script', (_, error) => {
  window.dispatchEvent(new CustomEvent('error-script', { detail: error }));
});

ipcRenderer.on('comparison-file-created', (_, comparisonFilePath) => {
  window.dispatchEvent(new CustomEvent('comparison-file-created', { detail: comparisonFilePath }));
});

ipcRenderer.on('comparison-cancelled', (_, cancelled) => {
  window.dispatchEvent(new CustomEvent('comparison-cancelled', { detail: cancelled }));
});

//Exponer la API
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('api', api);
  } catch (error) {
    console.error(error);
  }
} else {
  window.api = api;
}
