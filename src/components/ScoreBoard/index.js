import { Statistic } from 'semantic-ui-react'
import React from 'react'

const ScoreBoard = props => {
  const { players, scores, finished, size } = props
  const hasVoted = player => {
    const result = scores.find(s => s.name === player)
    return result && result.score > 0
  }
  return (
    <div>
      {players.length &&
      <Statistic.Group size={size} inverted widths={players.length}>
        {finished ?
          scores.map(p => (
            <Statistic key={p.name}>
              <Statistic.Value>
                {p.score}
              </Statistic.Value>
              <Statistic.Label className={size}>
                {p.name}
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

export default ScoreBoard