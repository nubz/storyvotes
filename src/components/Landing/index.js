import React, { useEffect, useState } from 'react'
import { Button, Segment, Card } from 'semantic-ui-react'
import { compose } from 'recompose'
import { withRouter } from 'react-router-dom'
import { withFirebase } from '../Firebase'
import Avatar from '../Avatar'

const Landing = props => {
  const { history, firebase } = props
  const [stories, setStories ] = useState([])
  useEffect(() => {
    const listRef = firebase.db.ref('stories/')
    const listListener = listRef
      .on("value", snapshot => {
        const newStories = []
        snapshot.forEach(item => {
          const story = item.val()
          story.id = item.key
          const numberJoined = story.joined ? Object.keys(story.joined).length : 0
          if (story.howManyPlayers > numberJoined) {
            story.numberJoined = numberJoined
            newStories.push(story)
          }
        })

        setStories(newStories)
      })

    return () => {
      listRef.off("value", listListener)
    }
  }, [firebase])
  const loadStory = id => () => {
    history.push('vote/' + id);
  }

  return (
    <Segment>
      <h1>Quizzes you can join</h1>
      {stories.length ?
        <Card.Group>
          {stories.map(s => (
            <Card key={s.id} color={'black'}>
              <Card.Content>
                <div style={{float: 'right'}}>
                  <Avatar size={'tiny'} id={s.owner} />
                </div>
                <Card.Header>{s.name}</Card.Header>
                <Card.Meta>{s.mode} mode</Card.Meta>
                <Card.Description>
                  {s.numberJoined} voters out of {s.howManyPlayers} joined
                </Card.Description>
              </Card.Content>
              <Card.Content extra>
                <Button primary style={{width: '100%'}} onClick={loadStory(s.id)}>Join</Button>
              </Card.Content>
            </Card>

          ))}
        </Card.Group>
        : <h2>No stories to vote on...</h2>}
    </Segment>
  );
}

const StoryList = compose(
  withFirebase,
  withRouter
)(Landing);

export default StoryList
