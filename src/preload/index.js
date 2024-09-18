import { contextBridge, ipcRenderer } from 'electron'; // Añadimos ipcRenderer para comunicación IPC
import { electronAPI } from '@electron-toolkit/preload';

// Exponemos la función para abrir el diálogo de selección de archivos
contextBridge.exposeInMainWorld('electronAPI', {
  openFileDialog: () => ipcRenderer.invoke('dialog:openFile') // Aquí invocamos el evento para abrir el diálogo
});

// Custom APIs for renderer
const api = {};

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