import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

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
    dropZoneContainer: {
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
    <div style={dropZoneStyle.dropZoneContainer}>
    </div>
  );
}

