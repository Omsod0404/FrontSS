import React, {useState, useCallback} from 'react'
import MainScreen from "./components/MainScreen.jsx";
import { useDropzone } from 'react-dropzone'

function App() {
  return (
    <div>
      <MainScreen/>
    </div>
  );
}

export default App;
