import { Statistic } from 'semantic-ui-react'
import React from 'react'

const ScoreBoard = props => {
  const { submissions, players, finished, size } = props

  const hasVoted = (player, s) => {
    return s && s[player]
  }
  return (
    <div>
      {players.length &&
      <Statistic.Group size={size} inverted widths={players.length}>
        {players.map(p => (
          <Statistic key={p}>
            <Statistic.Value>
              {finished ?
                <span className={'finalScore'}>
                  {submissions && submissions[p]}
                </span>
                :
                <span className={hasVoted(p, submissions) ? 'voted' : 'notVoted'}>
                  ?
                </span>
              }
            </Statistic.Value>
            <Statistic.Label className={size}>
              {p}
            </Statistic.Label>
          </Statistic>
        ))}
      </Statistic.Group>
      }
    </div>
  )
}


export default ScoreBoard