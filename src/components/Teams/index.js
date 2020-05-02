import React, { useEffect, useState } from 'react'
import { AuthUserContext, withAuthorization } from '../Session'
import { Button, List, Message, Segment, Confirm, Icon } from 'semantic-ui-react'
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
  const [ host, setHost ] = useState('')
  const [ confirm, setConfirm ] = useState(null)
  const [ copied, setCopied ] = useState(null)
  useEffect(() => {
    const teamListRef = firebase.db.ref('teams/')
    const teamListener = teamListRef
      .orderByChild('owner')
      .equalTo(authUser.uid)
      .on("value", snapshot => {
        setMyTeams(Utils.firebaseToArrayWithKey(snapshot.val()))
      })

    setHost(window.location)

    return () => {
      teamListRef.off("value", teamListener)
    }
  }, [ authUser, firebase ])

  const confirmDelete = id => () => setConfirm(id)
  const handleConfirm = fn => () => {
    fn()
    setConfirm(null)
  }
  const handleCancel = () => setConfirm(null)

  const copyUrlToClipboard = (host, id) => e => {
    const textField = document.createElement('textarea')
    textField.innerText = `${host.protocol}//${host.host}/team-access/${id}`
    document.body.appendChild(textField)
    textField.select()
    document.execCommand('copy')
    textField.remove()
    setCopied(id)
  }

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
        <h1>
          My teams
        </h1>
        <p>
          <Link to={ROUTES.NEW_TEAM}><Icon name={'plus'} /> Add a team</Link>
        </p>
        <p>
          Teams control access to stories for voters, grant voters access to teams by sharing the team access url with them.
          Voters do not need to create an account to vote, they just need the team access url.
        </p>
        {myTeams.length ?
          <List divided relaxed inverted>
            {
              myTeams.map(team => (
                <List.Item key={team.id}>
                  <List.Icon name='users' size='huge' verticalAlign='middle' />
                  <List.Content>
                    <List.Header>
                      <h2>
                        <Link to={`team-access/${team.id}`}>
                          {team.name}
                        </Link>
                      </h2>
                    </List.Header>
                    <List.Description>
                      <p>
                        {host && `${host.protocol}//${host.host}/team-access/${team.id}`}
                      </p>
                      <div style={{float: 'right'}}>
                        <Button primary icon labelPosition='left' style={{opacity: copied === team.id ? '0.6' : '1'}} size={'mini'} onClick={copyUrlToClipboard(host, team.id)}>
                          <Icon name='copy' />
                          {copied && copied === team.id ? `Copied!` : `Copy url`}
                        </Button>
                        <Button negative icon labelPosition='left' size={'mini'} onClick={confirmDelete(team.id)}>
                          <Icon name={'trash'} />
                          Delete team
                        </Button>
                      </div>
                      <Confirm
                        open={confirm === team.id}
                        header={`Permanently delete ${team.name}?`}
                        content={`Confirm you want to delete ${team.name} and all related stories`}
                        onCancel={handleCancel}
                        onConfirm={handleConfirm(removeTeam(team.id))}
                      />
                    </List.Description>
                  </List.Content>
                </List.Item>
              ))
            }
          </List>
        :
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
