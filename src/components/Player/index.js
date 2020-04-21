import React, { useEffect, useState } from 'react'
import { Button, Statistic } from 'semantic-ui-react'
import { useCookies } from 'react-cookie';

const Player = props => {
  const { story, players, submissions, submissionsPath, firebase } = props
  const [ locked, setLocked ] = useState(false)
  const [ finished, setFinished ] = useState(false)
  const [ scores, setScores ] = useState([])
  const [ playing, setPlaying ] = useState(false)
  const [ results, setResults ] = useState({})
  const [cookies] = useCookies([`${story.id}-name`]);
  useEffect(() => {
    const getSubmission = player =>
      submissions && submissions[player]
    if (players.length) {
      const updatedScores = players.reduce((list, next) => {
        const a = {}
        if (next === cookies[`${storyId}-name`]) {
          setPlaying(true)
        }
        a.name = next
        a.score = getSubmission(next)
        list.push(a)
        return list
      }, [])
      setScores(updatedScores)

    }
    if (submissions &&
      Object.keys(submissions).length === players.length) {
        setTimeout(() => {
            const topPlayers = []
            const lowPlayers = []
            const topScore = Math.max.apply(null, players.map(getSubmission))
            const minScore = Math.min.apply(null, players.map(getSubmission))
            players.forEach(p => {
              if(getSubmission(p) === topScore) {
                topPlayers.push(p)
              } else if (getSubmission(p) === minScore) {
                lowPlayers.push(p)
              }
            })
            setResults({high: topPlayers, low: lowPlayers})
            setFinished(true)

        }, 2000)
    }
  }, [submissions, players, cookies, playing, storyId])

  const answer = choice => async () => {
    setLocked(true)
    if (playing) {
      const oldSubmissions = submissions || {}
      const newSubmissions = {...oldSubmissions, [cookies[`${storyId}-name`]]:choice}
      await firebase.db.ref(submissionsPath + '/' + qIndex).update(newSubmissions)
    }
  }

  return (
    <>
      {players.length &&
        <Statistic.Group inverted widths={players.length}>
          {scores.map(p => (
            <Statistic key={p.name}>
              <Statistic.Value>{p.score}</Statistic.Value>
              <Statistic.Label>{p.name}</Statistic.Label>
            </Statistic>
          ))}
        </Statistic.Group>
      }

      {finished ?
        <>
          {results && results.high &&
            <div className={'winners'}>
              <h1>Voting over</h1>
              <h2>High voters:</h2>
              {results.high.map(w => (
                <div key={w}>
                  {w}
                </div>
                )
              )}
            </div>}
        </>
        :
        <>
          <h2 className={'question'}>{story.name}</h2>
          {!locked ?
            <>
              {playing ?
                <>
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
                  </>
                :
                <>
                  <p>Voters be voting...</p>
                </>}
            </> :
              <div className={'response'}>
                <h1>You have voted</h1>
                <p>Just waiting for everyone to vote...</p>
              </div>
          }

        </>
      }
    </>
  )
}

export default Player
