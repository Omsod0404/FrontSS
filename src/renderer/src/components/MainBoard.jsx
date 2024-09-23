import React, {useState, useCallback} from 'react'
import Header from './Header.jsx';
import DropZone from './DropZone.jsx';
import NewFileZone from './NewFileZone.jsx';
import Button from './Button.jsx';
import helpIcon from '../resources/helpIcon.png';

export default function MainBoard() {

  const styles = {
    mainBoard: {
      backgroundColor: 'white',
      height: '400px',
      width: '740px',
      borderRadius: '8px',
      display: 'flex',
      flexDirection: 'column',
    },
    uploadForm: {
      display: 'flex',
      flexDirection: 'column',
      margin: '0 30px 0 30px',
      marginBottom: '15px',
    },
    dropZoneContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      width: '100%',
    },
    details: {
      display: 'flex',
      fontSize: '14px',
      color: '#aaa',
      margin: '10px 0 10px 0',
      fontFamily: 'Arial, sans-serif',
    },
  }

  const [filePaths, setFilePaths] = useState({
    SIIA: [],
    CH: [],
  });

  return (
    <div style={styles.mainBoard}>

      <Header title='Upload Files'/>

      <form style={styles.uploadForm}>

        <div style={styles.dropZoneContainer}>
            <DropZone 
              text_file='SIIA' 
              filePaths={filePaths.SIIA} 
              setFilePaths={(paths) => setFilePaths({ ...filePaths, SIIA: paths })} 
              />
            <DropZone 
              text_file='CH' 
              filePaths={filePaths.CH} 
              setFilePaths={(paths) => setFilePaths({ ...filePaths, CH: paths })} 
              />
        </div>

        <div style={styles.details}>
          <p style={{margin: 0, padding: 0}}>Supported formats: XLS, XLSX</p>
        </div>

        <NewFileZone filePaths={filePaths}/>

      </form>

      <Button 
        text='User Guide'
        icon={helpIcon}
        iconSize='14px'
        height='auto'
        textColor='#A2A2A2'
        margin='0 0 0 30px'
        textDecoration='underline #A2A2A2'
        cursor='pointer'
      />

    </div>
  )
}
