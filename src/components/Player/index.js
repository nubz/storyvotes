import React, { useEffect, useState } from 'react'
import { Button, Icon, Message, Statistic } from 'semantic-ui-react'
import { useCookies } from 'react-cookie'
import ScoreBoard from '../ScoreBoard'
import { Link } from 'react-router-dom'

const Player = props => {
  const {
    storyId,
    players,
    howManyPlayers,
    storyName,
    submissions,
    submissionsPath,
    firebase,
    finished
  } = props
  const [ locked, setLocked ] = useState(false)
  const [ scores, setScores ] = useState([])
  const [ playing, setPlaying ] = useState(false)
  const [ results, setResults ] = useState({})
  const [cookies] = useCookies([`${storyId}-name`]);

  useEffect(() => {
    const getSubmission = player => submissions && submissions[player]
    setPlaying(players.includes(cookies[`${storyId}-name`]))
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
            const topPlayers = []
            const lowPlayers = []
            const allScores = players.map(getSubmission)
            const topScore = Math.max.apply(null, allScores)
            const minScore = Math.min.apply(null, allScores)
          players.forEach(p => {
              if(getSubmission(p) === topScore) {
                topPlayers.push(p)
              } else if (getSubmission(p) === minScore) {
                lowPlayers.push(p)
              }
            })
          setResults({high: topPlayers, low: lowPlayers, mostFrequent: mode(allScores) })
          firebase.db.ref('stories/' + storyId).update({finished: true})
        }, 2000)
    }
  }, [firebase, submissions, cookies, storyId, players, howManyPlayers])

  const answer = choice => async () => {
    setLocked(true)
    const oldSubmissions = submissions || {}
    const newSubmissions = {...oldSubmissions, [cookies[`${storyId}-name`]]:choice}
    await firebase.db.ref(submissionsPath).update(newSubmissions)
  }

  return (
    <>
      <h2 className={'question'}>{storyName}</h2>
      <ScoreBoard size={'large'} players={players} scores={scores} finished={finished}/>
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
                    Recommended Points
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
                  <Button className={'quizAnswer'} disabled={locked}
                          onClick={answer(1)}>1</Button>
                  <Button className={'quizAnswer'} disabled={locked}
                          onClick={answer(2)}>2</Button>
                  <Button className={'quizAnswer'} disabled={locked}
                          onClick={answer(3)}>3</Button>
                  <Button className={'quizAnswer'} disabled={locked}
                          onClick={answer(4)}>4</Button>
                  <Button className={'quizAnswer'} disabled={locked}
                          onClick={answer(5)}>5</Button>
                  <Button className={'quizAnswer'} disabled={locked}
                          onClick={answer(6)}>6</Button>
                  <Button className={'quizAnswer'} disabled={locked}
                          onClick={answer(7)}>7</Button>
                  <Button className={'quizAnswer'} disabled={locked}
                          onClick={answer(8)}>8</Button>
                  <Button className={'quizAnswer'} disabled={locked}
                          onClick={answer(9)}>9</Button>
                  <Button className={'quizAnswer'} disabled={locked}
                          onClick={answer(10)}>10</Button>
                  <Button className={'quizAnswer'} disabled={locked}
                          onClick={answer(11)}>11</Button>
                  <Button className={'quizAnswer'} disabled={locked}
                          onClick={answer(12)}>12</Button>
                  <Button className={'quizAnswer'} disabled={locked}
                          onClick={answer(13)}>13</Button>
                  <Button className={'quizAnswer'} disabled={locked}
                          onClick={answer(14)}>14</Button>
                  <Button className={'quizAnswer'} disabled={locked}
                          onClick={answer(15)}>15</Button>
                  <Button className={'quizAnswer'} disabled={locked}
                          onClick={answer(16)}>16</Button>
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
                <Message.Header>You have voted</Message.Header>
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
