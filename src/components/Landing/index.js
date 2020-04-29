import React, { useEffect, useState } from 'react'
import { Segment, Card, Header, Message } from 'semantic-ui-react'
import { compose } from 'recompose'
import { withFirebase } from '../Firebase'
import StoryCard from '../StoryCard'
import Utils from '../Utils'

const Landing = props => {
  const { firebase } = props
  console.log('rendering stories')
  const [teamStories, setTeamStories ] = useState([])
  useEffect(() => {
    const listRef = firebase.db.ref('stories/')
    const listListener = listRef
      .on("value", snapshot => {
        const teamAccess = Utils.getObj('teamAccess')
        const newTeamStories = []
        snapshot.forEach(team => {
          if (Array.isArray(teamAccess) && teamAccess.includes(team.key)) {
            team.forEach(t => {
              const story = t.val()
              story.id = t.key
              story.numberJoined = story.joined ? Object.keys(story.joined).length : 0
              newTeamStories.push(story)
            })
          }
        })
        setTeamStories(newTeamStories.reverse())
      })

    return () => {
      listRef.off("value", listListener)
    }
  }, [firebase])

  return (
    <Segment>
      <Header as='h2' dividing>
        Stories from all teams you have access to
      </Header>
      {teamStories.length ?
        <Card.Group>
          {teamStories.map(s => (
            <StoryCard firebase={firebase} key={s.id} story={s} />
          ))}
        </Card.Group>
        :
        <Message color={'black'}>
          <Message.Header>No stories to vote on</Message.Header>
          <p>
            When stories are available to vote on in the teams you have access to, they will appear here. You need to create an account to add stories.
          </p>
        </Message>
      }
    </Segment>
  );
}

const StoryList = compose(
  withFirebase
)(Landing);

export default StoryList
