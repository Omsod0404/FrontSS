import React, {useState, useCallback} from 'react'
import './MainBoard.css'
import Header from '../Header.jsx';
import DropZone from '../DropZone/DropZone.jsx';
import NewFileZone from '../NewFileZone/NewFileZone.jsx';
import Button from '../Button/Button.jsx';
import helpIcon from '../../resources/HelpIcon.png';

export default function MainBoard() {

  return (
    <div className='mainBoard'>

      <Header title='Upload Files'/>

      <form className="upload-form">

        <div className="dropzone-container">
            <DropZone text_file='SIIA'/>
            <DropZone text_file='CH'/>
        </div>

        <div className="upload-details">
          <p>Supported formats: XLS, XLSX</p>
        </div>

        <NewFileZone/>

      </form>

      <Button 
        text='User Guide'
        icon={helpIcon}
        iconSize='14px'
        height='auto'
        textColor='#A2A2A2'
        margin='0 0 0 30px'
      />

    </div>
  )
}
