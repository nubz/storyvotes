import React, { useState, useEffect } from 'react'
import { compose } from 'recompose'
import { withFirebase } from '../Firebase'

const TeamAvatar = props => {
  const { firebase, id, size } = props
  const [ team, setTeam ] = useState({})

  useEffect(() => {
    const teamRef = firebase.db
      .ref('teams/' + id)
    const teamListener = teamRef
      .on("value", snapshot => {
        setTeam(snapshot.val())
      });

    return () => {
      teamRef.off("value", teamListener)
    }
  }, [id, firebase])

  const avatarImg = team && team.poster ? team.poster : '/assets/images/default-avatar.png'

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
)(TeamAvatar)

export default AvatarImage
