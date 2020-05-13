import React, { useState, useEffect } from 'react'
import { withFirebase } from '../Firebase'
import AvatarBase from './base'

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
    <AvatarBase size={size} avatarImg={avatarImg} />
  )
}

export default withFirebase(Avatar)
