import React, { useEffect, useState } from 'react'
import { AuthUserContext, withAuthorization } from '../Session'
import { Button, List, Message, Segment } from 'semantic-ui-react'
import { compose } from 'recompose'
import { withFirebase } from '../Firebase'
import Utils from '../Utils'
import * as ROUTES from '../../constants/routes'
import { Link } from 'react-router-dom'

const TeamsView = props => (
  <AuthUserContext.Consumer>
    {authUser => (
      <Teams authUser={authUser} {...props}/>
    )}
  </AuthUserContext.Consumer>
);

const Teams = props => {
  const { authUser, firebase } = props
  const [ myTeams, setMyTeams ] = useState([])
  useEffect(() => {
    const teamListRef = firebase.db.ref('teams/')
    const teamListener = teamListRef
      .orderByChild('owner')
      .equalTo(authUser.uid)
      .on("value", snapshot => {
        setMyTeams(Utils.firebaseToArrayWithKey(snapshot.val()))
      })

    return () => {
      teamListRef.off("value", teamListener)
    }
  }, [ authUser, firebase ])

  const removeTeam = id => () => {
    firebase.db
      .ref('stories/')
      .child(id)
      .remove()
      .then(() => firebase.db
        .ref('teams/')
        .child(id)
        .remove()
        .then(
          () => console.log('removed team ' + id),
          err => console.error(err)
        ), err => console.error(err))
  }

  return (
    <div>
      <Segment padded>
        <h1>My teams</h1>
        <p>Teams are a simple way to group stories, when adding stories you can choose which team to add them to and share the team link to expose only stories from that team.</p>
        {myTeams.length ?
          <List divided relaxed inverted>
            {
              myTeams.map(team => (
                <List.Item key={team.id}>
                  <List.Content floated='right'>
                    <Button size={'mini'} onClick={removeTeam(team.id)}>Delete</Button>
                  </List.Content>
                  <List.Icon name='file outline' size='large' verticalAlign='middle' />
                  <List.Content>
                    <List.Header><Link to={`team-access/${team.id}`}>{team.name}</Link></List.Header>
                  </List.Content>
                </List.Item>
              ))
            }
          </List>:
          <Message>
            <Message.Header>You have no teams</Message.Header>
            <p>
              <a href={ROUTES.NEW_TEAM}>Add a team</a>
            </p>
          </Message>
        }
      </Segment>
    </div>
  );
};

const condition = authUser => !!authUser

const TeamsPage = compose(
  withFirebase
)(TeamsView)

export default withAuthorization(condition)(TeamsPage)
