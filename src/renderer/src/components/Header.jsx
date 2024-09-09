import React from 'react'

export default function Header(props) {
  return (
    <div style={headerStyle.headerContainer}>
      <h2 style={headerStyle.title}>{props.title}</h2>
    </div>
  )
}

const headerStyle = {
  headerContainer: {
    height: '60px',
    width: '100%',
  },
  title: {
    margin: '15px 30px 0 30px',
    fontSize: '25px',
    fontWeight: '600',
    fontFamily: 'Arial, sans-serif',
  }
}
