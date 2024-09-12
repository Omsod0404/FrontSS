import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Papelera from "../resources/PapeleraIcon.png";
import CargaArchivos from "../resources/ArchivosIcon.png";
import Button from "./Button";

export default function DropZone({ text_file, setFilePaths, filePaths = []}) {

  // Función para manejar el drop de archivos
  const onDrop = useCallback((acceptedFiles) => {
    // Filtrar archivos que no sean .xls o .xlsx
    const validFiles = acceptedFiles.filter((file) =>
      file.name.endsWith('.xls') || file.name.endsWith('.xlsx')
    );

    if (validFiles.length) {
      const paths = validFiles.map((file) => file.path);
      setFilePaths(paths);  // Guarda los paths de archivos válidos

      console.log(paths);   // Imprime los paths en consola
    } else {
      window.alert('Archivo no válido. Solo se permiten archivos .xls y .xlsx.');
    }
  }, [setFilePaths]);

  // Hook para dropzone
  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: '.xls,.xlsx',
    noClick: true, // Desactiva el click en la zona de drop
  });

  // Estilos de la zona de drop
  const dropZoneStyle = {
    dropZoneContainer: {
      width: '47%',
      height: '200px',
      borderWidth: '2px',
      borderStyle: 'dashed',
      borderColor: '#aaa',
      borderRadius: '10px',
      display: 'flex',
      position: 'relative',
      textAlign: 'center',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column'
    },
    dropText: {
      color: "black",
      fontWeight: "bold",
      fontSize: "15px",
      fontFamily: 'Arial, sans-serif',
    },
    subContainer: {
      alignItems: "center",
      flexDirection: "column",
      display: "flex",
    },
    iconSubida: {
      height: "50px",
      width: "50px",
      marginTop: "10px",
      marginBottom: "10px",
    },
    textChoose: {
      fontFamily: 'Arial, sans-serif',
      marginLeft: "5px",
      color: "#05549d",
      fontWeight: "bold",
      textDecoration: "underline",
      cursor: "pointer",
    },
    fileSourceText: {
      color: "#BABDCC",
      fontSize: "20px",
      fontWeight: "bold",
      flexDirection: "column",
      alignItems: "center",
      fontFamily: 'Arial, sans-serif',
      marginRight: "8px",
    },
  };

  return (
    <div style={dropZoneStyle.dropZoneContainer} {...getRootProps()}>

      <Button
        icon={Papelera}
        iconSize="25px"
        position="absolute"
        cursor="pointer"
        top="5px"
        left="90%"
      />

      <input {...getInputProps()} />

      {isDragActive ? (
        <p style={dropZoneStyle.dropText}>Drop the files here...</p>
      ) : (
        <div style={dropZoneStyle.subContainer}>
          <span style={dropZoneStyle.fileSourceText}>{text_file}</span>
          <img src={CargaArchivos} style={dropZoneStyle.iconSubida} alt="Upload" />
          <p style={dropZoneStyle.dropText}>
            Drag and Drop File or 
            <span style={dropZoneStyle.textChoose} onClick={open}>Choose File</span>
          </p>
        </div>
      )}

      {/* Renderiza los paths de los archivos */}
      {/* <ul>
        {filePaths && filePaths.map((fp, index) => (
          <li key={index}>{fp}</li>
        ))}
      </ul> */}

    </div>
  );
}