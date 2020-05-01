import { Button, Card } from 'semantic-ui-react'
import Avatar from '../Avatar'
import React, { useEffect, useState } from 'react'
import ScoreBoard from '../ScoreBoard'
import Utils from '../Utils'
import JoinVote from '../JoinVote'
import { Link } from 'react-router-dom'
import { AuthUserContext } from '../Session'
import { withRouter } from 'react-router-dom'

const StoryCardView = props => (
  <AuthUserContext.Consumer>
    {authUser => (
      <StoryCard authUser={authUser} {...props}/>
    )}
  </AuthUserContext.Consumer>
);

const StoryCard = props => {
  const { story, firebase, authUser, history } = props
  const joined = Utils.firebaseToArray(story.joined)
  const [ submissions, setSubmissions ] = useState({})
  useEffect(() => {
    const submissionsRef = firebase.db.ref(`submissions/${story.id}`)
    const submissionsListener = submissionsRef
      .on("value", snapshot => {
        setSubmissions(snapshot.val())
      })
    return () => {
      submissionsRef.off("value", submissionsListener)
    }
  }, [ story.id, firebase ])

  const closeVoting = s => e => {
    e.preventDefault()
    const updates = {
      howManyPlayers: joined.length
    }
    if (s && Object.keys(s).length === joined.length) {
      updates.finished = firebase.database.ServerValue.TIMESTAMP
    }
    firebase.db
      .ref(`stories/${story.teamId}/${story.id}`)
      .update(updates)
      .then(() => {
        history.push(`vote/${story.teamId}/${story.id}`)
      })
  }

  return (
    <>
    {story.id &&
      <Card color={'black'}>
        <Card.Content>
          <div style={{float: 'right'}}>
            <Avatar size={'tiny'} id={story.owner} />
          </div>
          <Card.Header>
            <Link style={{color: 'white'}} to={`/vote/${story.teamId}/${story.id}`}>{story.name}</Link>
          </Card.Header>
          <Card.Meta>{story.mode} mode</Card.Meta>
          <Card.Description>
            {story.numberJoined} voters out of {story.howManyPlayers} joined
          </Card.Description>
        </Card.Content>
        <Card.Content extra>
          <ScoreBoard
            firebase={firebase}
            size={'mini'}
            submissions={submissions}
            storyPath={`stories/${story.teamId}/${story.id}`}
            players={joined}
            maxPlayers={story.howManyPlayers}
            finished={story.finished}/>
        </Card.Content>
        {story.howManyPlayers > joined.length &&
          <Card.Content extra>
            {authUser && joined.length > 0 &&
              <Button primary style={{marginBottom: '1em'}} onClick={closeVoting(submissions)}>Close off registration</Button>}
            <JoinVote
              story={story}
              players={joined}
              firebase={firebase}/>
          </Card.Content>
          }
      </Card>
    }
    </>
  )
}


export default withRouter(StoryCardView)


