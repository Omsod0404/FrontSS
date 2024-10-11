import React, { useEffect, useState } from 'react';
import Button from './Button.jsx';
import Swal from 'sweetalert2';
import DroppedFileIcon from '../resources/dropped_file_icon.png'; 
import { Oval } from 'react-loader-spinner';
import path from 'path-browserify';

export default function NewFileZone({ filePaths }) {
  const [isComparing, setIsComparing] = useState(false);
  const [isNewFileReady, setIsNewFileReady] = useState(false);
  const [tempFolderPath, setTempFolderPath] = useState('');
  const [isErrorFromScript, setIsErrorFromScript] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [comparisonFilePath, setComparisonFilePath] = useState('');
  const [executablePath, setExecutablePath] = useState('');
  const [fileInfo, setFileInfo] = useState({ name: '', size: '' });

  useEffect(() => {
    const fetchInitialData = async () => {
      const executablePath = await window.api.getExecutablePath();
      const folderPath = await window.api.getTempFolder();
      setTempFolderPath(folderPath);
      setExecutablePath(executablePath);
      console.log('Temp folder path:', folderPath);
      console.log('Executable path:', executablePath);
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    const handleScriptError = (event) => {
      setIsErrorFromScript(event.detail.error);
      setErrorMessage(event.detail.message);
    };
    window.addEventListener('error-script', handleScriptError);

    const handleComparisonFileCreated = async (event) => {
      setComparisonFilePath(event.detail);
      setIsComparing(false);
      setIsNewFileReady(true);
      const filePath = event.detail;
      const name = path.basename(filePath.replace(/\\/g, '/')); // Reemplazar \ por / para asegurar compatibilidad en windows y unix
      const size = await window.api.getFileSize(filePath); // Obtener el tamaño del archivo
      setFileInfo({ name, size }); // Actualizar nombre y tamaño del archivo
    };
    window.addEventListener('comparison-file-created', handleComparisonFileCreated);

    const handleComparisonCancelled = () => {
      setIsComparing(false);
    };
    window.addEventListener('comparison-cancelled', handleComparisonCancelled);

    return () => {
      window.removeEventListener('error-script', handleScriptError);
      window.removeEventListener('comparison-file-created', handleComparisonFileCreated);
      window.removeEventListener('comparison-cancelled', handleComparisonCancelled);
    };
  }, []);

  useEffect(() => {
    if (isErrorFromScript) {
      console.log('Error from script:', errorMessage);
      showErrorScript();
    }
  }, [isErrorFromScript]); // Se ejecuta cada vez que cambia isErrorFromScript

  const handleCompareClick = async () => {
    setIsComparing(true);
    await window.api.executeCompareFiles(filePaths.SIIA[0], filePaths.CH[0], tempFolderPath);
  };

  const handleCancelClick = async () => {
    await window.api.cancelComparison();
    setIsComparing(false);
  };

  const handleDownloadClick = async (event) => {
    event.preventDefault();
    await window.api.saveComparisonFile(comparisonFilePath);
  };

  const handleClearClick = async () => {
    await window.api.clearLoadedFiles();
    setIsComparing(false);
    setIsNewFileReady(false);
    setComparisonFilePath('');
    window.location.reload();
  };

  const showErrorScript = () => {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      html: 'Error al comparar archivos. <br><br> Por favor, inténtalo de nuevo. Verifique que los archivos sean los correctos',
      showConfirmButton: true,
      confirmButtonText: 'Ok',
      confirmButtonColor: '#e53e3e',
      didOpen: () => {
        const popup = document.querySelector('.swal2-popup');
        if (popup) {
          popup.style.fontFamily = 'Arial, sans-serif';
          popup.style.fontSize = '14px';
        }
      }
    }).then(() => {
      setIsErrorFromScript(false); // Restablecer el estado tras el cierre del modal
      setIsComparing(false);
    });
  };

  const style = {
    newFileZone: {
      height: '50px',
      width: '100%',
      borderRadius: '10px',
      display: 'flex',
      alignItems: 'center',
      position: 'relative',
      backgroundColor: isComparing || isNewFileReady ? '#f3f5f7' : '',
    },
    comparingText: {
      marginLeft: '5px',
      fontSize: '12px',
      fontWeight: 'bold',
      color: 'black',
      marginRight: '8px',
      fontFamily: 'Arial, sans-serif',
      display: 'flex',
      alignItems: 'center',
    },
    // spinner: {
    //   border: '2px solid black',
    //   borderTop: '2px solid white',
    //   borderRadius: '50%',
    //   width: '13px',
    //   height: '13px',
    //   animation: 'spin 2s linear infinite',
    // },
    // '@keyframes spin': {
    //   '0%': { transform: 'rotate(0deg)' },
    //   '100%': { transform: 'rotate(360deg)' }
    // },
    button: {
      marginLeft: '10px',
    },
    fileInfo: {
      display: 'flex',
      flexDirection: 'column',
      marginLeft: '10px',
      fontFamily: 'Arial, sans-serif',
    },
    fileName: {
      fontSize: '12px',
      fontWeight: 'bold',
    },
    fileSize: {
      fontSize: '10px',
      marginTop: '5px',
      color: '#CDCACA',
      fontWeight: 'bold',
    },
    iconContainer: {
      display: 'flex',
      alignItems: 'center',
      marginLeft: '20px',
    }
  };

  return (
    <div style={style.newFileZone}>
      {!isComparing && !isNewFileReady && (
        <Button
          height='35px'
          width='100px'
          text='Comparar'
          backgroundColor={((filePaths.SIIA.length >= 1) && (filePaths.CH.length >= 1)) ? '#05549D' : '#aaa'}
          backgroundColorOnHover = '#2C6FAC'
          backgroundColorOnClic = '#598DBE'
          borderRadius='5px'
          textColor='white'
          position='absolute'
          top='7.5px'
          left='572.5px'
          cursor='pointer'
          disabled={((filePaths.SIIA.length >= 1) && (filePaths.CH.length >= 1)) ? false : true}
          onClick={handleCompareClick}
          fontSize='14px'
        />
      )}

      {isComparing && (
        <>
          <div style={style.iconContainer}>
            <img src={DroppedFileIcon} alt="Dropped File Icon" style={{ width: '16px', height: '16px', marginRight: '5px'}} />
            <p style={style.comparingText}>Comparando, espera un momento...</p>
          </div>
          <div>
          <Oval
            visible={true}
            height={15}
            width={15}
            color="#000000"
            ariaLabel="oval-loading"
            secondaryColor="#ddd"
            strokeWidth={3}
            strokeWidthSecondary={3}
          />
          </div>
          <Button
            height='35px'
            width='90px'
            text='Cancelar'
            backgroundColor='white'
            borderRadius='5px'
            border= '1px solid #E3E3E3'
            textColor='black'
            fontSize='13px'
            position='absolute'
            top='7.5px'
            left='560px'
            cursor='pointer'
            fontWeight='bold'
            backgroundColorOnHover='#FCEBEB'
            backgroundColorOnClic='#FEE0E0'
            onClick={handleCancelClick}
            style={style.button}
          />
        </>
      )}

      {!isComparing && isNewFileReady && (
        <>
          <div style={style.iconContainer}>
            <img src={DroppedFileIcon} alt="Dropped File Icon" style={{ width: '16px', height: '16px', marginRight: '5px' }} />
            <div style={style.fileInfo}>
              <span style={style.fileName}>{fileInfo.name}</span>
              <span style={style.fileSize}>{fileInfo.size}</span>
            </div>
          </div>
          <Button
            height='35px'
            width='90px'
            text='Descargar'
            backgroundColor='green'
            backgroundColorOnHover='#28a745'
            backgroundColorOnClic='#218838'
            borderRadius='5px'
            textColor='white'
            position='absolute'
            top='7.5px'
            left='560px'
            cursor='pointer'
            fontWeight='bold'
            fontSize = '13px'
            onClick={handleDownloadClick}
            style={style.button}
          />
          <Button
            height='32px'
            width='90px'
            text='Limpiar'
            fontSize = '13px'
            backgroundColor='#ba3c3c'
            backgroundColorOnHover='#ef5350'
            backgroundColorOnClic='#bd2130'
            borderRadius='5px'
            textColor='white'
            position='absolute'
            top='62px'
            left='560px'
            cursor='pointer'
            fontWeight='bold'
            border='none'
            outline='none'
            onClick={handleClearClick}
            style={style.button}
          />
        </>
      )}
    </div>
  );
}
