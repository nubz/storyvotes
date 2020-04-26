import { Statistic } from 'semantic-ui-react'
import React, { useEffect } from 'react'
import { compose } from 'recompose'
import { withFirebase } from '../Firebase'

const ScoreBoardBase = props => {
  const { storyPath, firebase, players, maxPlayers, submissions, finished, size } = props
  useEffect(() => {
    if (!finished && maxPlayers && submissions && maxPlayers === Object.keys(submissions).length) {
      firebase.db.ref(storyPath)
        .update({
          finished: firebase.database.ServerValue.TIMESTAMP
        })
    }
  }, [submissions, maxPlayers, firebase, storyPath, finished])
  const hasVoted = player => {
    return submissions && submissions[player]
  }
  return (
    <div>
      {players.length &&
      <Statistic.Group size={size} inverted widths={players.length}>
        {finished ?
          players.map(p => (
            <Statistic key={p}>
              <Statistic.Value>
                {submissions[p]}
              </Statistic.Value>
              <Statistic.Label className={size}>
                {p}
              </Statistic.Label>
            </Statistic>
          ))
          :
          players.map(p => (
            <Statistic key={p}>
              <Statistic.Value>
                <span className={hasVoted(p) ? 'voted' : 'notVoted'}>
                  ?
                </span>
              </Statistic.Value>
              <Statistic.Label>
                {p}
              </Statistic.Label>
            </Statistic>
          ))
        }
      </Statistic.Group>
      }
    </div>
  )
}

const ScoreBoard = compose(
  withFirebase
)(ScoreBoardBase)

export default ScoreBoard