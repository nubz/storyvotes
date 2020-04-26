import React, { useState } from 'react'
import { compose } from 'recompose'
import { withFirebase } from '../Firebase'
import { withAuthUser, withAuthorization } from '../Session';
import { withRouter } from 'react-router-dom'
import { Form, Input, Button, Container } from 'semantic-ui-react'

const TeamCreate = props => {
  const { firebase, authUser, history } = props
  const [ teamName, setTeamName ] = useState('')

  async function createTeam() {
    const storyConfig = {
      owner: authUser.uid,
      name: teamName
    }
    await firebase.db.ref('teams').push(storyConfig)
    history.push(`/`)
  }

  const onTextChange = setter => event => {
    setter(event.target.value)
  }

  const invalidForm = teamName.length < 3

  return (
    <Container className={'page'}>
      <h1>Add a team</h1>
      <Form onSubmit={createTeam} style={{marginBottom: '3em'}}>
        <Form.Field>
          <Input
            name="teamName"
            label="Team name"
            type="text"
            value={teamName}
            onChange={onTextChange(setTeamName)}
            placeholder="Team name"
          >
            <input autoComplete="off"/>
          </Input>
        </Form.Field>
        <Button disabled={invalidForm} type='submit'>Add team</Button>
      </Form>
    </Container>
  )
}

const condition = authUser => !!authUser;

const NewTeam = compose(
  withFirebase,
  withAuthUser,
  withRouter
)(TeamCreate);

export default withAuthorization(condition)(NewTeam);
