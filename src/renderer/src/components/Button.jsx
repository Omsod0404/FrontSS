import React, {useState} from 'react'

export default function Button(props) {
  const [hover, setHover] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);

  const buttonStyle = {
    button: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: props.height ? props.height : 'fit-content',
      width: props.width ? props.width : 'fit-content',
      backgroundColor: props.backgroundColor 
        ? isMouseDown && props.backgroundColorOnClic 
          ? props.backgroundColorOnClic 
          : hover && props.backgroundColorOnHover
            ? props.backgroundColorOnHover
            : props.backgroundColor 
        : 'transparent',
      margin: props.margin ? props.margin : '0',
      position: props.position ? props.position : 'relative',
      border: props.border ? props.border : 'none',
      borderRadius: props.borderRadius ? props.borderRadius : '0',
      textDecoration: (hover && props.textDecoration) ? props.textDecoration : 'none',
      top: props.top ? props.top : '0',
      left: props.left ? props.left : '0',
      right: props.right ? props.right : '0',
      bottom: props.bottom ? props.bottom : '0',
      cursor: (hover && props.cursor) ? props.cursor : 'default',
      transition: 'background-color 0.2s',
    },
    text: {
      fontFamily: 'Arial, sans-serif',
      fontSize: props.fontSize ? props.fontSize : '14px',
      fontWeight: props.fontWeight ? props.fontWeight : 'bold',
      color: props.textColor ? props.textColor : 'black',
      margin: '0',
      padding: '0',
    },
    icon: {
      height: props.iconSize,
      marginRight: '5px',
    }
  }

  return (
    <button 
      style={buttonStyle.button} 
      onMouseEnter={()=> setHover(true)} 
      onMouseLeave={()=> setHover(false)} 
      onMouseDown={()=> setIsMouseDown(true)}
      onMouseUp={()=> setIsMouseDown(false)}
      disabled={props.disabled}
      onClick={props.onClick}
      type='button'
      >
      {props.icon && <img src={props.icon} style={buttonStyle.icon} draggable='false'/>}
      <p style={buttonStyle.text}>{props.text}</p>
    </button>
  )
}
