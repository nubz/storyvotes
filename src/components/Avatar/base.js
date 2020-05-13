import React from 'react'

export default props => {
  const { size, avatarImg } = props
  return (
    <div
      className={`avatarImage ${size}`}
      style={{
        backgroundImage: `url(${avatarImg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        border: '2px solid white'
      }}
    />
  )
}

