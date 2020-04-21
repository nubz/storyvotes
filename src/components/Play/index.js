import React, { useState, useEffect } from 'react'
import { compose } from 'recompose'
import { withFirebase } from '../Firebase'
import * as ROUTES from '../../constants/routes';
import { Link } from 'react-router-dom';
import Utils from '../Utils'
import Player from '../Player'
import JoinVote from '../JoinVote'
import { Container } from 'semantic-ui-react'

const Play = props => {
  const { firebase } = props
  const [story, setStory] = useState({})
  const [ players, setPlayers ] = useState([])
  const [ submissions, setSubmissions ] = useState({})
  const storyId = props.match.params.id;
  const storyPath = "stories/" + storyId
  const submissionsPath = "submissions/" + storyId
  useEffect(() => {
    const quizRef = firebase.db.ref(storyPath);
    const quizListener = quizRef
      .on("value", snapshot => {
        const s = snapshot.val();
        setPlayers(Utils.firebaseToArray(s.joined))
        setStory(s)
      });

    const submissionsRef = firebase.db.ref(submissionsPath)
    const submissionsListener = submissionsRef
      .on("value", snapshot => {
        setSubmissions(snapshot.val())
      })

    return () => {
      quizRef.off("value", quizListener)
      submissionsRef.off("value", submissionsListener)
    }
  }, [firebase, storyPath, submissionsPath])

  const waitingForPlayers = story.howManyPlayers - players.length
  return (
    <Container className={'page'}>
      {story ?
        waitingForPlayers ?
          <>
            <h2>We are waiting for {waitingForPlayers} to join {story.name}</h2>
            <JoinVote
              storyId={storyId}
              players={players}
              storyPath={storyPath}
              firebase={firebase}/>
          </>
          :
          <Player
            story={story}
            players={players}
            submissions={submissions}
            submissionsPath={submissionsPath}
            firebase={firebase}/>
        :
        <p>cannot find that story, <Link to={ROUTES.LANDING}>try again</Link></p>
      }
    </Container>
  )
}

const LoadStory = compose(
  withFirebase
)(Play);
export default LoadStory
