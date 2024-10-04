import { MSICreator } from 'electron-wix-msi';
import path from 'path';

// Step 1: Instantiate the MSICreator
const msiCreator = new MSICreator({
  appDirectory: path.resolve('C:/Users/josaf/OneDrive/Documentos/Trabajos/Servicio Social/FrontSS/build/Comparador_CD-win32-x64'), // Ruta al directorio empaquetado
  description: 'Comparator for excel files',
  exe: 'Comparador_CD', // Nombre del archivo ejecutable
  name: 'Comparador CD', // Nombre de la aplicación
  manufacturer: 'Centro de desarrollo', // Nombre del desarrollador o empresa
  version: '1.0.0', // Versión de la aplicación
  outputDirectory: path.resolve('C:/Users/josaf/OneDrive/Documentos/Trabajos/Servicio Social/FrontSS/installer'), // Directorio de salida del MSI
  appIconPath: path.resolve('C:/Users/josaf/OneDrive/Documentos/Trabajos/Servicio Social/FrontSS/build/icon.ico'), // Ruta del ícono
  ui: {
    chooseDirectory: true, // Habilita la opción para elegir el directorio de instalación
  },
  shortcutFolderName: 'Comparador CD', // Nombre de la carpeta de accesos directos en el menú de inicio
});

// Step 2: Create the .wxs template file
async function createMSI() {
  try {
    const supportBinaries = await msiCreator.create();

    // Step 2a: Optionally sign binaries (for code signing, if needed)
    // supportBinaries.forEach(async (binary) => {
    //   await signFile(binary); // Si tienes firma digital, puedes agregarla aquí
    // });

    // Step 3: Compile the .wxs template to an .msi installer
    await msiCreator.compile();

    console.log('MSI Installer created successfully!');
  } catch (error) {
    console.error('Error creating MSI installer:', error);
  }
}

createMSI();