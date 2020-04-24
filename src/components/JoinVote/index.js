import { Button, Icon, Input } from 'semantic-ui-react'
import React, { useState } from 'react'
import { useCookies } from 'react-cookie';
import { withRouter } from 'react-router-dom'
import { compose } from 'recompose'

const JoinForm = props => {
  const { storyId, firebase, players, history } = props
  const [nickName, setNickName ] = useState('')
  const [cookies, setCookie] = useCookies([`${storyId}-name`]);
  const onChange = setter => event => {
    setter(event.target.value);
  }
  const invalidNickName = nickName.length < 1
  const join = async function (e) {
    e.preventDefault()
    const newJoined = players ? players : []
    const exists = players.filter(p => p === nickName)
    const uniqueNickName = exists.length ?
      `${nickName}-${players.filter(p => p.startsWith(nickName)).length}` : nickName
    newJoined.push(uniqueNickName)
    await firebase.db.ref('stories/' + storyId).update({joined: newJoined})
    setCookie(`${storyId}-name`, uniqueNickName, { path: '/' })
    history.push(`vote/${storyId}`)
  }
  return (
    <>
      {cookies[`${storyId}-name`] ?
        <h1>You have joined as {cookies[`${storyId}-name`]}</h1>
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

