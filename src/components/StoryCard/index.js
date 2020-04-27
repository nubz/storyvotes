import { Card } from 'semantic-ui-react'
import Avatar from '../Avatar'
import React, { useEffect, useState } from 'react'
import ScoreBoard from '../ScoreBoard'
import Utils from '../Utils'
import JoinVote from '../JoinVote'
import { Link } from 'react-router-dom'

const StoryCard = props => {
  const { story, firebase } = props
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


export default StoryCard


