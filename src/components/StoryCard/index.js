import { Card } from 'semantic-ui-react'
import Avatar from '../Avatar'
import React, { useEffect, useState } from 'react'
import { compose } from 'recompose'
import { withFirebase } from '../Firebase'
import ScoreBoard from '../ScoreBoard'
import Utils from '../Utils'
import JoinVote from '../JoinVote'
import { Link } from 'react-router-dom'

const StoryCard = props => {
  const { story, canJoin, firebase } = props
  const [ submissions, setSubmissions ] = useState({})
  useEffect(() => {
    const submissionsPath = 'submissions/' + story.id
    const submissionsRef = firebase.db.ref(submissionsPath)
    const submissionsListener = submissionsRef
      .on("value", snapshot => {
        setSubmissions(snapshot.val())
      })
    return () => {
      submissionsRef.off("value", submissionsListener)
    }
  }, [firebase, submissions, story])

  return (
    <>
    {story && story.id &&
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
            size={'mini'}
            storyPath={`stories/${story.teamId}/${story.id}`}
            players={Utils.firebaseToArray(story.joined)}
            maxPlayers={story.howManyPlayers}
            submissions={submissions}
            finished={story.finished}/>
        </Card.Content>
        {canJoin &&
          <Card.Content extra>
            <JoinVote
              story={story}
              players={Utils.firebaseToArray(story.joined)}
              firebase={firebase}/>
          </Card.Content>
          }
      </Card>
    }
    </>
  )
}

const StoryCardDeps = compose(
  withFirebase
)(StoryCard);

export default StoryCardDeps


