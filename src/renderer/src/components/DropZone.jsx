import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Papelera from "../resources/PapeleraIcon.png";
import CargaArchivos from "../resources/ArchivosIcon.png";
import DropeedFile from "../resources/dropped_file_icon.png";
import Button from "./Button";

import Swal from 'sweetalert2';
import styled from 'styled-components';

export default function DropZone({ text_file, setFilePaths, filePaths = []}) {
  // Nuevos estados para manejar el estado de carga del archivo
  const [fileDropped, setFileDropped] = useState(false);
  const [fileUploaded, setFileUploaded] = useState(false);
  const [fileName, setFileName] = useState('');

  // Función para manejar el drop de archivos
  const onDrop = useCallback((acceptedFiles) => {
    // Filtrar archivos que no sean .xls o .xlsx
    const validFiles = acceptedFiles.filter((file) =>
      file.name.endsWith('.xls') || file.name.endsWith('.xlsx')
    );

    if (validFiles.length) {
      const paths = validFiles.map((file) => file.path);
      setFilePaths(paths);  // Guarda los paths de archivos válidos
      setFileDropped(true);
      setFileUploaded(true);
      setFileName(validFiles[0].name);
      console.log(paths);   // Imprime los paths en consola
    } else {
      showErrorTypeFile();
    }
  }, [setFilePaths]);

  // Nueva función para eliminar el archivo
  const removeFile = () => {
    setFilePaths([]);
    setFileDropped(false);
    setFileUploaded(false);
    setFileName('');
  };

  // Hook para dropzone
  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: '.xls,.xlsx',
    noClick: true, // Desactiva el click en la zona de drop
    disabled: fileUploaded, // Deshabilita el dropzone cuando se ha cargado un archivo
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

  const showErrorTypeFile = () => {
    Swal.fire({
      title: 'Error!',
      text: 'Archivo no válido. Solo se permiten archivos .xls y .xlsx.',
      icon: 'error',
      confirmButtonText: 'Ok',
      didOpen: () => {
        const popup = document.querySelector('.swal2-popup');
        if (popup) {
          popup.style.fontFamily = 'Arial, sans-serif'; // Cambia la fuente
          popup.style.fontSize = '14px'; // Cambia el tamaño de la fuente
        }
      }
    });
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
        onClick={removeFile} // Agregado el evento onClick para eliminar el archivo
      />

      <input {...getInputProps()} />

      {isDragActive ? (
        <p style={dropZoneStyle.dropText}>Drop the files here...</p>
      ) : (
        <div style={dropZoneStyle.subContainer}>
          {!fileDropped && <span style={dropZoneStyle.fileSourceText}>{text_file}</span>}
          <img
            src={fileDropped ? DropeedFile : CargaArchivos}
            style={dropZoneStyle.iconSubida}
            alt="Upload"
            draggable='false'
          />
          {!fileDropped ? (
            <p style={dropZoneStyle.dropText}>
              Drag and Drop File or
              <span style={dropZoneStyle.textChoose} onClick={open}>Choose File</span>
            </p>
          ) : (
            <p style={dropZoneStyle.dropText}>{fileName}</p>
          )}
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