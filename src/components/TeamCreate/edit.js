import React, { useEffect, useState } from 'react'
import { compose } from 'recompose'
import { withFirebase } from '../Firebase'
import { withAuthUser, withAuthorization } from '../Session';
import { withRouter } from 'react-router-dom'
import { Form, Input, Button, Container, Message, Header } from 'semantic-ui-react'
import Gallery from '../Gallery'
import Uploader from '../Uploader'

const TeamEdit = props => {
  const { firebase, authUser } = props
  const teamId = props.match.params.id
  const [ teamName, setTeamName ] = useState('')
  const [ team, setTeam ] = useState(null)
  const [ authorized, setAuthorized ] = useState(false)
  useEffect(() => {
    const teamRef = firebase.db.ref('teams/' + teamId)
    const teamListener = teamRef
      .on("value", snapshot => {
        const oldTeam = snapshot.val()
        if (oldTeam.owner === authUser.uid) {
          setAuthorized(true)
          setTeamName(oldTeam.name)
          setTeam(oldTeam)
        } else {
          setAuthorized(false)
        }
      })

    return () => {
      teamRef.off("value", teamListener)
    }
  }, [teamId, authUser, firebase])

  const handleUpload = downloadUrl => {
    const pRef = firebase.db.ref('teams/' + teamId);
    return pRef.update({poster: downloadUrl})
  };

  async function editTeam() {
    const teamUpdates = {
      name: teamName
    }
    await firebase.db.ref('teams/' + teamId).update(teamUpdates)
  }

  const onTextChange = setter => event => {
    setter(event.target.value)
  }

  const invalidForm = teamName.length < 3

  return (
    <Container className={'page'}>
      {team ?
        <>
          <h1>Edit {team.name}</h1>
          {authorized ?
            <>
            <Form onSubmit={editTeam} style={{marginBottom: '3em'}}>
              <h2>New team name</h2>
              <Form.Field>
                <Input
                  name="teamName"
                  type="text"
                  value={teamName}
                  onChange={onTextChange(setTeamName)}
                  placeholder="Team name"
                >
                  <input autoComplete="off"/>
                </Input>
              </Form.Field>
              <Button disabled={invalidForm} type='submit'>Save new team name</Button>
            </Form>
              <Header as={'h2'}>Change team poster</Header>
              {team.poster ? <Gallery photos={[team.poster]} /> : null}
              <Uploader folder={authUser.uid} handler={handleUpload} />
              </>
            :
            <Message color={'red'}>
              <Message.Header>Not authorised</Message.Header>
              <p>
                You cannot edit this team.
              </p>
            </Message>
          }
        </>
        :
        <Message color={'red'}>
          <Message.Header>Team not found</Message.Header>
          <p>
            No team found with this id
          </p>
        </Message>
      }
    </Container>
  )
}

const condition = authUser => !!authUser;

const Editor = compose(
  withFirebase,
  withAuthUser,
  withRouter
)(TeamEdit);

export default withAuthorization(condition)(Editor);
