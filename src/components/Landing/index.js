import React, { useEffect, useState } from 'react'
import { Segment, Card, Header, Message } from 'semantic-ui-react'
import { compose } from 'recompose'
import { withFirebase } from '../Firebase'
import StoryCard from '../StoryCard'
import Utils from '../Utils'

const Landing = props => {
  const { firebase } = props
  const [stories, setStories ] = useState([])
  const [fullStories, setFullStories ] = useState([])
  const teamAccess = Utils.getObj('teamAccess')
  useEffect(() => {
    const listRef = firebase.db.ref('stories/')
    const listListener = listRef

      .on("value", snapshot => {
        const newStories = []
        const fullStories = []
        snapshot.forEach(childSnapshot => {
          if (teamAccess && teamAccess.includes(childSnapshot.key)) {
            const stories = Utils.firebaseToArrayWithKey(childSnapshot.val())
            stories.forEach(story => {
              const numberJoined = story.joined ? Object.keys(story.joined).length : 0
              story.numberJoined = numberJoined
              if (story.howManyPlayers > numberJoined) {
                newStories.push(story)
              } else {
                fullStories.push(story)
              }
            })
          }
        })

        setStories(newStories.reverse())
        setFullStories(fullStories.reverse())
      })

    return () => {
      listRef.off("value", listListener)
    }
  }, [firebase, teamAccess])

  return (
    <Segment>
      <Header as='h2' dividing>
        Stories from all teams you have access to
      </Header>
      {stories.length ?
        <Card.Group>
          {stories.map(s => (
            <StoryCard key={s.id} story={s} canJoin={true} />
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
      <Header as='h2' dividing>
        Stories with all voters registered
      </Header>
      {fullStories.length ?
        <Card.Group>
          {fullStories.map(s => (
            <StoryCard key={s.id} story={s} canJoin={false} />
          ))}
        </Card.Group>
        :
        <Message color={'black'}>
          <Message.Header>No stories fully registered</Message.Header>
          <p>
            Stories with all voters registered will appear here.
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
