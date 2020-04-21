import { Button, Icon, Input } from 'semantic-ui-react'
import React, { useState } from 'react'
import { useCookies } from 'react-cookie';

const JoinVote = props => {
  const { storyId, storyPath, firebase, players } = props
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
      `${nickName}${players.filter(p => p.startsWith(nickName)) + 1}` : nickName
    newJoined.push(uniqueNickName)
    await firebase.db.ref(storyPath).update({joined: newJoined})
    setCookie(`${storyId}-name`, uniqueNickName, { path: '/' })
  }
  return (
    <>
      {cookies[`${storyId}-name`] ?
        <>
          <h1>You have joined as {cookies[`${storyId}-name`]}</h1>
        </>
        :
        <>
          <h1>Register to vote</h1>
          <form onSubmit={join} style={{marginBottom: '3em'}}>
            <Input
              iconPosition="left"
              name="nickname"
              type="text"
              value={nickName}
              onChange={onChange(setNickName)}
              placeholder="Your nickname"
              style={{marginBottom: '1em'}}
            >
              <Icon name="user outline"/>
              <input autoComplete="off"/>
            </Input>
            <Button disabled={invalidNickName}>
              Join vote
            </Button>
          </form>
        </>
      }
    </>
  )
}

export default JoinVote
