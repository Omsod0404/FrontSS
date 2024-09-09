import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import './DropZone.css';
import Papelera from '../../resources/PapeleraIcon.png';
import Archivos from '../../resources/ArchivosIcon.png';

export default function DropZone({ text_file }) {
  const [Hover, setHover] = useState(false)

  const onDrop = useCallback((acceptedFiles, category) => {
    setFiles(prevFiles => ({ ...prevFiles, [category]: acceptedFiles[0] }));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => onDrop(acceptedFiles, 'siia'),
    accept: '.xls,.xlsx'
  });

  const dropZoneStyle = {
    dropZone: {
      width: '47%',
      height: '200px',
      borderWidth: '2px',
      borderStyle: 'dashed',
      borderColor: '#aaa',
      borderRadius: '8px',
      display: 'flex',
      position: 'relative',
      textAlign: 'center'

    }
  }
  return (
    <div {...getRootProps()} 
      style={dropZoneStyle.dropZone} 
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}>

        <input {...getInputProps()} />

        {isDragActive ? (
          <p>Drop the files here...</p>
        ) : (
          <p style={dropZoneStyle.dropText}>
            <span style={dropZoneStyle.fileSource}>{text_file}</span>
            <br />Drag and Drop File or <span style={dropZoneStyle.chooseFile}>Choose File</span>
          </p>
        )}
      </div>
  );
}

