import React, {useEffect, useState} from 'react'
import Button from './Button.jsx';

export default function NewFileZone({filePaths}) {

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

  const style = {
    newFileZone: {
      height: '50px',
      width: '100%',
      borderRadius: '10px',
      display: 'flex',
      alignItems: 'center',
      position: 'relative',
      backgroundColor: isNewFileReady ? 'rgba(0, 0, 0, 0.1)' : 'transparent',
    }
  }

  return (
    <div style={style.newFileZone}>
      {!isNewFileReady && (
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
            onClick={() => showTempFolderPath()}
          />
        </>
      )}
    </div>
  )
}
