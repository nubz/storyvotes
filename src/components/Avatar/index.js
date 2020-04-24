import React, { useState, useEffect } from 'react'
import { compose } from 'recompose'
import { withFirebase } from '../Firebase'

const Avatar = props => {
  const { firebase, id, size } = props
  const [ profile, setProfile ] = useState({})

  useEffect(() => {
    const profileRef = firebase.db
      .ref('profiles/' + id)
    const profileListener = profileRef
      .on("value", snapshot => {
        setProfile(snapshot.val())
      });

    return () => {
      profileRef.off("value", profileListener)
    }
  }, [id, firebase])

  const avatarImg = profile && profile.avatar ? profile.avatar : '/assets/images/default-avatar.png'

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
};

const AvatarImage = compose(
  withFirebase,
)(Avatar)

export default AvatarImage
