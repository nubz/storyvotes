import React, { useState, useEffect } from 'react'
import { compose } from 'recompose'
import { withFirebase } from '../Firebase'
import { withAuthUser, withAuthorization } from '../Session';
import { withRouter } from 'react-router-dom'
import { Form, Input, Button, Container, Select, Radio } from 'semantic-ui-react'
import Utils from '../Utils'
import * as ROUTES from '../../constants/routes'

const Story = props => {
  const { firebase, authUser, history } = props
  const [howManyPlayers, setHowManyPlayers ] = useState(0)
  const [ teamId, setTeamId ] = useState('')
  const [ teams, setTeams ] = useState([])
  const [ storyName, setStoryName ] = useState('')
  const [ mode, setMode ] = useState('Days')

  useEffect(() => {
    const teamRef = firebase.db.ref('teams/')
    const teamListener = teamRef
      .orderByChild('owner')
      .equalTo(authUser.uid)
      .on("value", snapshot => {
        const newTeams = Utils.firebaseToArrayWithKey(snapshot.val())
        const teamOptions = newTeams.map(team => {
          return {key: team.id, value: team.id, text: team.name}
        })
        setTeams(teamOptions)
      })

    return () => {
       teamRef.off("value", teamListener)
    }
  }, [firebase, authUser])

  async function generateStory() {
    const storyConfig = {
      owner: authUser.uid,
      mode: mode,
      howManyPlayers: howManyPlayers,
      name: storyName,
      teamId: teamId
    }
    await firebase.db.ref('stories/' + teamId).push(storyConfig)
    history.push(`/team-access/${teamId}`)
  }

  const onNumberChange = setter => event => {
    setter(parseInt(event.target.value))
  };

  const onTextChange = setter => event => {
    setter(event.target.value)
  }

  const onSelectChange = setter => (event, data) => {
    setter(data.value)
  }

  const invalidForm = howManyPlayers < 1 || storyName.length < 2 || teamId.length < 6

  return (
    <Container className={'page'}>
      <h1>Add a team story</h1>
      {teams.length ?
        <Form onSubmit={generateStory} style={{marginBottom: '3em'}}>
          <Form.Field>
            <h3>Select which team</h3>
            <Select
              placeholder='Select which team'
              value={teamId}
              onChange={onSelectChange(setTeamId)}
              options={teams} />
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
          <h3>Select the voting system</h3>
          {mode && Object.keys(Utils.decks).map(o => (
            <Form.Field key={o}>
              <Radio
                label={o}
                name='mode'
                value={o}
                checked={mode === o}
                onChange={onSelectChange(setMode)}
              />
            </Form.Field>
          ))}
          <Button disabled={invalidForm} type='submit'>Add story</Button>
        </Form>
          :
        <p>You need to add a team before adding a story, <a href={ROUTES.NEW_TEAM}>add a team</a></p>
      }
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
