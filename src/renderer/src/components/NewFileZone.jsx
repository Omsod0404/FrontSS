import React, { useEffect, useState } from 'react';
import Button from './Button.jsx'; // Asegúrate de que el botón esté correctamente importado
import Swal from 'sweetalert2';
import DroppedFileIcon from '../resources/dropped_file_icon.png'; // Asegúrate de tener el ícono en la ruta correcta
import { Oval } from 'react-loader-spinner';

export default function NewFileZone({ filePaths }) {
  const [isComparing, setIsComparing] = useState(false);
  const [isNewFileReady, setIsNewFileReady] = useState(false);
  const [tempFolderPath, setTempFolderPath] = useState('');
  const [isErrorFromScript, setIsErrorFromScript] = useState(false);
  const [comparisonFilePath, setComparisonFilePath] = useState('');

  useEffect(() => {
    const fetchInitialData = async () => {
      const folderPath = await window.api.getTempFolder();
      setTempFolderPath(folderPath);
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    const handleScriptError = (event) => {
      setIsErrorFromScript(event.detail);
    };
    window.addEventListener('error-script', handleScriptError);

    const handleComparisonFileCreated = (event) => {
      setComparisonFilePath(event.detail);
      setIsComparing(false);
      setIsNewFileReady(true);
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
  };

  const showErrorScript = () => {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      html: 'Error while comparing files, please try again. Take on mind the order of files',
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
    downloadButton: {
      height: '35px',
      width: '90px',
      backgroundColor: 'green',
      borderRadius: '5px',
      color: 'white',
      position: 'absolute',
      top: '7.5px',
      left: '572.5px',
      cursor: 'pointer',
      fontWeight: 'bold',
    },
    clearButton: {
      height: '32px',
      width: '130px',
      backgroundColor: '#ba3c3c',
      borderRadius: '5px',
      color: 'white',
      position: 'absolute',
      top: '62px',
      left: '533px',
      cursor: 'pointer',
      fontWeight: 'bold',
      border: 'none',
      outline: 'none',
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
          text='Compare'
          backgroundColor={((filePaths.SIIA.length >= 1) && (filePaths.CH.length >= 1)) ? '#05549D' : '#aaa'}
          backgroundColorOnHover = '#2C6FAC'
          backgroundColorOnClic = '#598DBE'
          borderRadius='10px'
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
            <img src={DroppedFileIcon} alt="Dropped File Icon" style={{ width: '16px', height: '16px', marginRight: '5px' }} />
            <p style={style.comparingText}>Comparing</p>
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
            text='Cancel'
            backgroundColor='white'
            borderRadius='5px'
            border= '1px solid #E3E3E3'
            textColor='black'
            fontSize='13px'
            position='absolute'
            top='7.5px'
            left='572.5px'
            cursor='pointer'
            fontWeight='bold'
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
              <span style={style.fileName}>comparing.xls</span>
              <span style={style.fileSize}>15 KB</span>
            </div>
          </div>
          <button style={style.downloadButton} onClick={handleDownloadClick}>
            Download
          </button>
          <button style={style.clearButton} onClick={handleClearClick}>
            Clear
          </button>
        </>
      )}
    </div>
  );
}