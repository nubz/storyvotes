import React, { useState, useEffect } from 'react'
import { compose } from 'recompose'
import { withFirebase } from '../Firebase'
import * as ROUTES from '../../constants/routes';
import { Link } from 'react-router-dom';
import Utils from '../Utils'
import Player from '../Player'
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
    const storyRef = firebase.db.ref(storyPath);
    const storyListener = storyRef
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
      storyRef.off("value", storyListener)
      submissionsRef.off("value", submissionsListener)
    }
  }, [firebase, storyPath, submissionsPath])

  return (
    <Container className={'page'}>
      {story ?
        <Player
          storyId={storyId}
          howManyPlayers={story.howManyPlayers}
          players={players}
          storyName={story.name}
          submissions={submissions}
          submissionsPath={submissionsPath}
          firebase={firebase}
          finished={story.finished}/>
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
