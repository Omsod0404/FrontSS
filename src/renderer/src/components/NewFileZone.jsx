import React, { useEffect, useState } from 'react';
import Button from './Button.jsx'; // Asegúrate de que el botón esté correctamente importado

export default function NewFileZone({ filePaths }) {
  const [isComparing, setIsComparing] = useState(false);

  const [isNewFileReady, setIsNewFileReady] = useState(false);
  const [tempFolderPath, setTempFolderPath] = useState('');

  useEffect(() => {
    const fetchTempFolder = async () => {
      const folderPath = await window.api.getTempFolder();
      setTempFolderPath(folderPath);
    };
    fetchTempFolder();
  }, []);

  const showTempFolderPath = () => {
    console.log(tempFolderPath);
  }
  const handleCompareClick = () => {
    setIsComparing(true);
    // Lógica adicional de comparación podría ir aquí
  };

  const handleCancelClick = () => {
    setIsComparing(false);
    // Lógica para detener el proceso de comparación
  };

  const style = {
    newFileZone: {
      height: '50px',
      width: '100%',
      borderRadius: '10px',
      display: 'flex',
      alignItems: 'center',
      position: 'relative',
      backgroundColor: isComparing ? '#f3f5f7' : '',
    },
    comparingText: {
      marginLeft: '20px',
      fontSize: '12px',
      fontWeight: 'bold',
      color: 'black',
      marginRight: '8px',
      fontFamily: 'Arial, sans-serif',
    },
    spinner: {
      border: '2px solid black',
      borderTop: '2px solid white',
      borderRadius: '50%',
      width: '13px',
      height: '13px',
      animation: 'spin 2s linear infinite',
    },
    '@keyframes spin': {
      '0%': { transform: 'rotate(0deg)' },
      '100%': { transform: 'rotate(360deg)' }
    },
    button: {
      marginLeft: '10px',
    }
  };

  return (
    <div style={style.newFileZone}>
      {!isComparing && (
        <>
          <Button
            height='35px'
            width='100px'
            text='Compare'
            backgroundColor={((filePaths.SIIA.length >= 1) && (filePaths.CH.length >= 1)) ? '#05549D' : '#aaa'}
            borderRadius='10px'
            textColor='white'
            position='absolute'
            top='7.5px'
            left='572.5px'
            cursor='pointer'
            disabled={((filePaths.SIIA.length >= 1) && (filePaths.CH.length >= 1)) ? false : true}
            onClick={handleCompareClick}
          />
        </>
      )}

      {isComparing && (
        <>
          <p style={style.comparingText}>Comparing</p>
          <div style={style.spinner}></div>
          <Button
            height='35px'
            width='90px'
            text='Cancel'
            backgroundColor='white'
            borderRadius='5px'
            border = '1px solid #E3E3E3'
            textColor='black'
            fontSize = '13px'
            position='absolute'
            top='7.5px'
            left='572.5px'
            cursor='pointer'
            fontWeight = 'bold'
            onClick={handleCancelClick}
            style={style.button}
          />
        </>
      )}
    </div>
  );
}
