import React, {useState} from 'react'
import Button from './Button.jsx';

export default function NewFileZone() {

  const [isNewFileReady, setIsNewFileReady] = useState(false);

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
            backgroundColor='#05549D'
            borderRadius='10px'
            textColor='white'
            position='absolute'
            top='7.5px'
            left='572.5px'
            cursor='pointer'
          />
        </>
      )}
    </div>
  )
}
