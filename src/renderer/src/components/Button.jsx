import React from 'react'

export default function Button(props) {
  const [hover, setHover] = React.useState(false);

  const buttonStyle = {
    button: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: props.height ? props.height : 'fit-content',
      width: props.width ? props.width : 'fit-content',
      backgroundColor: props.backgroundColor ? props.backgroundColor : 'transparent',
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
    },
    text: {
      fontFamily: 'Arial, sans-serif',
      fontSize: props.fontSize ? props.fontSize : '14px',
      fontWeight: props.fontWeight ? props.fontWeight : 'normal',
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
      disabled={props.disabled}
      >
      {props.icon && <img src={props.icon} style={buttonStyle.icon}/>}
      <p style={buttonStyle.text}>{props.text}</p>
    </button>
  )
}
