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
  const [ scores, setScores ] = useState([])
  useEffect(() => {
    const submissionsPath = 'submissions/' + story.id
    const getSubmission = player => submissions && submissions[player]
    const submissionsRef = firebase.db.ref(submissionsPath)
    const submissionsListener = submissionsRef
      .on("value", snapshot => {
        setSubmissions(snapshot.val())
        const updatedScores = Utils.firebaseToArray(story.joined).reduce((list, next) => {
          const a = {}
          a.name = next
          a.score = getSubmission(next)
          list.push(a)
          return list
        }, [])
        setScores(updatedScores)
      })
    return () => {
      submissionsRef.off("value", submissionsListener)
    }
  }, [firebase, submissions, story])

  return (
    <Card color={'black'}>
      <Card.Content>
        <div style={{float: 'right'}}>
          <Avatar size={'tiny'} id={story.owner} />
        </div>
        <Card.Header>
          <Link style={{color: 'white'}} to={`vote/${story.id}`}>{story.name}</Link>
        </Card.Header>
        <Card.Meta>{story.mode} mode</Card.Meta>
        <Card.Description>
          {story.numberJoined} voters out of {story.howManyPlayers} joined
        </Card.Description>
      </Card.Content>
      <Card.Content extra>
        <ScoreBoard size={'mini'} players={Utils.firebaseToArray(story.joined)} scores={scores} finished={story.finished} />
      </Card.Content>
      {canJoin &&
        <Card.Content extra>
          <JoinVote
            storyId={story.id}
            players={Utils.firebaseToArray(story.joined)}
            firebase={firebase}/>
        </Card.Content>
        }
    </Card>
  )
}

const StoryCardDeps = compose(
  withFirebase
)(StoryCard);

export default StoryCardDeps


