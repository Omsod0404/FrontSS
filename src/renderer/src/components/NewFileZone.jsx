import React, {useState} from 'react'

export default function NewFileZone() {

  const [isNewFileReady, setIsNewFileReady] = useState(false);

  const style = {
    newFileZone: {
      height: '50px',
      width: '100%',
      borderRadius: '10px',
      display: 'flex',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
    }
  }

  return (
    <div style={style.newFileZone}>
      {!isNewFileReady && (
        <>
          
        </>
      )}
    </div>
  )
}
