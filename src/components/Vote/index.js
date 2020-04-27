import React, { useState, useEffect } from 'react'
import { compose } from 'recompose'
import { withFirebase } from '../Firebase'
import * as ROUTES from '../../constants/routes';
import { Link } from 'react-router-dom';
import Utils from '../Utils'
import { Button, Container, Icon, Message, Statistic } from 'semantic-ui-react'
import ScoreBoard from '../ScoreBoard'
import { useCookies } from 'react-cookie'
import ErrorBoundary from '../ErrorBoundary'

const Vote = props => {
  const { firebase } = props
  const [story, setStory] = useState({})
  const [ players, setPlayers ] = useState([])
  const [ submissions, setSubmissions ] = useState({})
  const [ hasVoted, setHasVoted ] = useState(false)
  const [ isVoting, setIsVoting ] = useState(false)
  const [ mostFrequent, setMostFrequent ] = useState([])
  const teamId = props.match.params.teamId
  const storyId = props.match.params.id;
  const [cookies] = useCookies([`${storyId}-name`])
  const storyPath = `stories/${teamId}/${storyId}`
  const submissionsPath = "submissions/" + storyId

  useEffect(() => {
    const mode = arr => [...new Set(arr)]
      .map((value) => [value, arr.filter((v) => v === value).length])
      .sort((a,b) => a[1]-b[1])
      .reverse()
      .filter((value, i, a) => a.indexOf(value) === i)
      .filter((v, i, a) => v[1] === a[0][1])
      .map((v) => v[0])

    const findMostFrequent = s => {
      const keys = Object.keys(s)
      if (s && keys.length) {
        return mode(keys.reduce((list, next) => {
          list.push(s[next])
          return list
        }, []))
      }
      return []
    }
    const storyRef = firebase.db.ref(storyPath);
    const storyListener = storyRef
      .on("value", snapshot => {
        const s = snapshot.val();
        const p = Utils.firebaseToArray(s.joined)
        setIsVoting(p.includes(cookies[`${storyId}-name`]))
        setPlayers(p)
        setStory(s)
      });

    const submissionsRef = firebase.db.ref(submissionsPath)
    const submissionsListener = submissionsRef
      .on("value", snapshot => {
        const s = snapshot.val()
        setSubmissions(s)
        setMostFrequent(findMostFrequent(s))
      })


    return () => {
      storyRef.off("value", storyListener)
      submissionsRef.off("value", submissionsListener)
    }
  }, [firebase, cookies, storyId, storyPath, submissionsPath])

  const answer = choice => async () => {
    setHasVoted(true)
    const oldSubmissions = submissions || {}
    const newSubmissions = {...oldSubmissions, [cookies[`${storyId}-name`]]:choice}
    await firebase.db.ref(submissionsPath).update(newSubmissions)
    if (Object.keys(newSubmissions).length === players.length) {
      firebase.db.ref(storyPath).update({finished: firebase.database.ServerValue.TIMESTAMP})
    }
  }

  const generateOptions = mode => {
    let options
    switch(mode) {
      case 'Days':
      default:
        options = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
        break
      case 'Fibonaci':
        options = [1, 2, 3, 5, 8, 13, 21, 34, 55]
        break
      case 'Scrum':
        options = [0.5, 1, 2, 3, 4, 5, 6, 7, 8]
        break
    }

    return options.map(o => (
      <Button key={`option-${o}`} className={'vote'} disabled={hasVoted} onClick={answer(o)}>{o}</Button>
    ))
  }

  return (
    <ErrorBoundary>
      <Container className={'page'}>
        {story ?
          <>
            <ScoreBoard
              size={'large'}
              firebase={firebase}
              submissions={submissions}
              storyPath={storyPath}
              players={players}
              maxPlayers={story.howManyPlayers}
              finished={story.finished}/>
            <h2 className={'question'}>{story.name}</h2>
            {story.finished ?
              <Message color={'black'} style={{backgroundColor: 'transparent', textAlign: 'center'}}>
                <Message.Header>Voting complete, the scores with most votes:</Message.Header>
                <div style={{textAlign: 'center'}}>
                  {mostFrequent && mostFrequent.map(h => (
                    <Statistic size={'huge'} key={`stat-${h}`}>
                      <Statistic.Value>
                        <span className={'notVoted'}>{h}</span>
                      </Statistic.Value>
                      <Statistic.Label>
                        {mostFrequent.length > 1 ? 'Joint candidate' : 'Recommended points'}
                      </Statistic.Label>
                    </Statistic>
                  ))
                  }
                </div>
                <p style={{textAlign: 'center'}}>
                  <Link as={'h2'} to={'/'}>Return to start</Link>
                </p>
              </Message>
              :
              <>
                {!hasVoted ?
                  <>
                    {isVoting ?
                      <div style={{marginTop: '2em'}}>
                        <h3>Choose how many points to vote for</h3>
                        {generateOptions()}
                      </div>
                      :
                      <Message color={'black'} icon>
                        <Icon name='circle notched' loading/>
                        <Message.Content>
                          <Message.Header>You are not voting</Message.Header>
                          Just waiting for everyone to vote...
                        </Message.Content>
                      </Message>
                    }
                  </>
                  :
                  <Message color={'black'} icon>
                    <Icon name='circle notched' loading/>
                    <Message.Content>
                      <Message.Header>Your vote has been registered</Message.Header>
                      Just waiting for everyone to vote...
                    </Message.Content>
                  </Message>
                }
              </>
              }
            </>
            :
            <p>cannot find that story, <Link to={ROUTES.LANDING}>see what stories you can access</Link></p>
          }
      </Container>
    </ErrorBoundary>
  )
}

const LoadStory = compose(
  withFirebase
)(Vote);
export default LoadStory
