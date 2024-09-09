import React from 'react'
import './Button.css'

export default function Button(props) {
  const buttonStyle = {
    button: {
      height: props.height ? props.height : 'fit-content',
      width: props.width ? props.width : 'fit-content',
      backgroundColor: props.backgroundColor ? props.backgroundColor : 'transparent',
      margin: props.margin ? props.margin : '0',
      position: props.position ? props.position : 'relative',
    },
    text: {
      color: props.textColor ? props.textColor : 'black',
    }
  }

  return (
    <button className='button' style={buttonStyle.button}>
      {props.icon && <img src={props.icon} className='buttonIcon' style={{height: props.iconSize}}/>}
      <p className='buttonText' style={buttonStyle.text}>{props.text}</p>
    </button>
  )
}
