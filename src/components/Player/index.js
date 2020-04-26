import React, { useEffect, useState } from 'react'
import { Button, Icon, Message, Statistic } from 'semantic-ui-react'
import { useCookies } from 'react-cookie'
import ScoreBoard from '../ScoreBoard'
import { Link } from 'react-router-dom'

const Player = props => {
  const {
    storyName,
    storyId,
    teamId,
    players,
    howManyPlayers,
    submissions,
    submissionsPath,
    firebase,
    finished
  } = props
  const [ locked, setLocked ] = useState(false)
  const [ scores, setScores ] = useState([])
  const [ playing, setPlaying ] = useState(false)
  const [ results, setResults ] = useState({})
  const [cookies] = useCookies([`${storyId}-name`])
  setPlaying(players.includes(cookies[`${storyId}-name`]))
  useEffect(() => {
    const getSubmission = player => submissions && submissions[player]

    const updatedScores = players.reduce((list, next) => {
      const a = {}
      a.name = next
      a.score = getSubmission(next)
      list.push(a)
      return list
    }, [])

    setScores(updatedScores)

    const mode = (arr) => [...new Set(arr)]
      .map((value) => [value, arr.filter((v) => v === value).length])
      .sort((a,b) => a[1]-b[1])
      .reverse()
      .filter((value, i, a) => a.indexOf(value) === i)
      .filter((v, i, a) => v[1] === a[0][1])
      .map((v) => v[0])

    if (submissions && players.length &&
      Object.keys(submissions).length === howManyPlayers) {
        setTimeout(() => {
            const allScores = players.map(getSubmission)
          setResults({mostFrequent: mode(allScores)})
          firebase.db.ref(`stories/${teamId}/${storyId}`)
            .update({
              finished: firebase.database.ServerValue.TIMESTAMP
            })
        }, 1000)
    }
  }, [players, submissions, howManyPlayers, firebase.db, firebase.database.ServerValue.TIMESTAMP, teamId, storyId] )

  const answer = choice => async () => {
    setLocked(true)
    const oldSubmissions = submissions || {}
    const newSubmissions = {...oldSubmissions, [cookies[`${storyId}-name`]]:choice}
    await firebase.db.ref(submissionsPath).update(newSubmissions)
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
      <Button key={`option-${o}`} className={'quizAnswer'} disabled={locked} onClick={answer(o)}>{o}</Button>
    ))
  }

  return (
    <>
      <ScoreBoard size={'large'} players={players} scores={scores} finished={finished}/>
      <h2 className={'question'}>{storyName}</h2>
      {finished ?
        <Message color={'black'}>
          <Message.Header>Voting over, the scores with most votes:</Message.Header>
          <div style={{textAlign: 'center'}}>
            {results && results.mostFrequent &&
              results.mostFrequent.map(h => (
                <Statistic size={'huge'} key={`stat-${h}`}>
                  <Statistic.Value>
                    {h}
                  </Statistic.Value>
                  <Statistic.Label>
                    {results.mostFrequent.length > 1 ? 'Joint candidate' : 'Recommended points'}
                  </Statistic.Label>
                </Statistic>
              ))
            }
          </div>
          {results && results.high && <p>High voters: {results.high.join(', ')}</p>}
          {results && results.low && <p>Low voters: {results.low.join(', ')}</p>}
          <p style={{textAlign: 'center'}}>
            <Link as={'h2'} style={{color: 'white'}} to={'/'}>Return to start</Link>
          </p>
        </Message>
        :
        <>
          {!locked ?
            <>
              {playing ?
                <div style={{marginTop: '2em'}}>
                  <h3>Choose how many points to vote for</h3>
                  {generateOptions()}
                </div>
                :
                <Message color={'black'} icon>
                  <Icon name='circle notched' loading />
                  <Message.Content>
                    <Message.Header>You are not voting</Message.Header>
                    Just waiting for everyone to vote...
                  </Message.Content>
                </Message>
              }
            </>
            :
            <Message color={'black'} icon>
              <Icon name='circle notched' loading />
              <Message.Content>
                <Message.Header>Your vote has been registered</Message.Header>
                Just waiting for everyone to vote...
              </Message.Content>
            </Message>
          }
        </>
      }
    </>
  )
}

export default Player
