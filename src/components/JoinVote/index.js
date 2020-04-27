import { Button, Icon, Input } from 'semantic-ui-react'
import React, { useState } from 'react'
import { useCookies } from 'react-cookie';
import { withRouter } from 'react-router-dom'
import { compose } from 'recompose'

const JoinForm = props => {
  const { story, firebase, players, history } = props
  const cookieName = `${story.id}-name`
  const [nickName, setNickName ] = useState('')
  const [cookies, setCookie] = useCookies([cookieName]);
  const onChange = setter => event => {
    setter(event.target.value);
  }
  const invalidNickName = nickName.length < 1
  const join = function (e) {
    e.preventDefault()
    const newJoined = players ? players : []
    const exists = players.filter(p => p === nickName)
    const uniqueNickName = exists.length ?
      `${nickName}-${players.filter(p => p.startsWith(nickName)).length}` : nickName
    newJoined.push(uniqueNickName)
    setCookie(cookieName, uniqueNickName, { path: '/' })
    firebase.db
      .ref('stories/' + story.teamId + '/' + story.id)
      .update({joined: newJoined})
      .then(() => {
        history.push(`/vote/${story.teamId}/${story.id}`)
      }, err => console.log(err))
  }
  return (
    <>
      {cookies[cookieName] && story && story.id ?
        <h2>
          <a href={`/vote/${story.teamId}/${story.id}`}>
            You can vote as {cookies[cookieName]}
          </a>
        </h2>
        :
        <form onSubmit={join}>
          <Input
            iconPosition="left"
            name="nickname"
            type="text"
            value={nickName}
            onChange={onChange(setNickName)}
            placeholder="Your nickname"
            style={{marginBottom: '1em', width: '100%'}}
          >
            <Icon name="user outline"/>
            <input autoComplete="off"/>
          </Input>
          <Button disabled={invalidNickName} primary style={{width: '100%'}}>Join</Button>
        </form>
      }
    </>
  )
}

const JoinVote = compose(
  withRouter
)(JoinForm);

export default JoinVote

