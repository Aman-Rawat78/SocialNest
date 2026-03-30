import React from 'react'

export const Online = () => {
  return (
    <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          background: '#52c41a',
          color: '#fff',
          textAlign: 'center',
          padding: '10px',
          zIndex: 10000
        }}>
          Internet is connected
        </div>
  )
}


export const Offline = () => {
  return (
    <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          background: '#ff4d4f',
          color: '#fff',
          textAlign: 'center',
          padding: '10px',
          zIndex: 9999
        }}>
          No internet connection
        </div>
  )
}
