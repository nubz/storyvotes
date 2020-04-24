import React, { useState } from 'react'
import { compose } from 'recompose'
import { withFirebase } from '../Firebase'
import { withAuthUser, withAuthorization } from '../Session';
import { withRouter } from 'react-router-dom'
import { Form, Input, Button, Container } from 'semantic-ui-react'

const Story = props => {
  const { firebase, authUser, history } = props
  const [howManyPlayers, setHowManyPlayers ] = useState(0)
  const [ storyName, setStoryName ] = useState('')

  async function generateStory() {
    const storyConfig = {
      owner: authUser.uid,
      mode: 'Days',
      howManyPlayers: howManyPlayers,
      name: storyName
    }
    await firebase.db.ref('stories').push(storyConfig)
    history.push(`/`)
  }

  const onNumberChange = setter => event => {
    setter(parseInt(event.target.value))
  };

  const onTextChange = setter => event => {
    setter(event.target.value)
  }

  const invalidForm = howManyPlayers < 1

  return (
    <Container className={'page'}>
      <h1>Add a story</h1>
      <Form onSubmit={generateStory} style={{marginBottom: '3em'}}>
        <Form.Field>
          <h3>Story name</h3>
          <Input
            name="storyName"
            type="text"
            value={storyName}
            onChange={onTextChange(setStoryName)}
            placeholder="Story name"
          >
            <input autoComplete="off"/>
          </Input>
        </Form.Field>
        <Form.Field>
          <h3>How many voters</h3>
          <Input
            name="howManyPlayers"
            type="number"
            value={howManyPlayers}
            onChange={onNumberChange(setHowManyPlayers)}
            placeholder="How many voters"
            style={{minWidth: '60px', width: '10%'}}
          >
            <input autoComplete="off"/>
          </Input>
        </Form.Field>
        <Button disabled={invalidForm} type='submit'>Add story</Button>
      </Form>
    </Container>
  )
}

const condition = authUser => !!authUser;

const StoryAdmin = compose(
  withFirebase,
  withAuthUser,
  withRouter
)(Story);

export default withAuthorization(condition)(StoryAdmin);
