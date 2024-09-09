import React, {useState} from 'react'
import './NewFileZone.css'

export default function NewFileZone() {

  const [isNewFileReady, setIsNewFileReady] = useState(false);

  return (
    <div className='newFileZone'>
      {!isNewFileReady && (
        <>
          <button className='compareButton'>
            <p>Compare</p>
          </button>
        </>
      )}
    </div>
  )
}
