import React from 'react'
import logoCD2 from '../resources/LogoCD2.png'
import logoUAQ from '../resources/LogoUAQ.png'
import MainBoard from './MainBoard.jsx'
import { useDropzone } from 'react-dropzone'

export default function MainScreen() {


  return (
    <div style={mainScreenStyle.mainContainer}>
      <div style={mainScreenStyle.logosContainer}>
        <img src={logoCD2} style={mainScreenStyle.logos} draggable='false'/>
        <img src={logoUAQ} style={mainScreenStyle.logos} draggable='false'/>
      </div>
      <div style={mainScreenStyle.contentContainer}>
        <MainBoard/>
      </div>
    </div>
  )
}

const mainScreenStyle = {
  mainContainer: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'white',
    userSelect: 'none',
  },
  logosContainer: {
    height: '80px',
    width: '100%',
    display: 'flex',
    alignItems: 'end',
    justifyContent: 'space-between',
  },
  logos: {
    height: '60px',
    marginLeft: '20px',
    marginRight: '20px',

  },
  contentContainer: {
    height: '490px',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
  }
}
