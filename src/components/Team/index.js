import React, { useEffect, useState } from 'react'
import { Segment, Card, Header, Message } from 'semantic-ui-react'
import { compose } from 'recompose'
import { withFirebase } from '../Firebase'
import StoryCard from '../StoryCard'
import Utils from '../Utils'

const Team = props => {
  const { firebase } = props
  const [stories, setStories ] = useState([])
  const [ team, setTeam ] = useState({})
  const [fullStories, setFullStories ] = useState([])
  const teamId = props.match.params.id;
  const storyPath = `stories/${teamId}`
  const teamPath = `teams/${teamId}`
  const teamAccess = Utils.getObj('teamAccess')
  if (!teamAccess) {
    Utils.storeObj('teamAccess', [teamId])
  } else if (teamAccess.length && !teamAccess.includes(teamId)) {
    Utils.storeObj('teamAccess', [...teamAccess, teamId])
  }
  useEffect(() => {
    const teamRef = firebase.db.ref(teamPath)
    const teamListener = teamRef
      .on("value", snapshot => {
        setTeam(snapshot.val())
      })
    const listRef = firebase.db.ref(storyPath)
    const listListener = listRef
      .on("value", snapshot => {
        const newStories = []
        const fullStories = []
        snapshot.forEach(item => {
          const story = item.val()
          story.id = item.key
          const numberJoined = story.joined ? Object.keys(story.joined).length : 0
          story.numberJoined = numberJoined
          if (story.howManyPlayers > numberJoined) {
            newStories.push(story)
          } else {
            fullStories.push(story)
          }
        })

        setStories(newStories.reverse())
        setFullStories(fullStories.reverse())
      })

    return () => {
      listRef.off("value", listListener)
      teamRef.off("value", teamListener)
    }
  }, [firebase, storyPath, teamPath])

  return (
    <Segment>
      <Header as='h2' dividing>
        Stories from {team.name}
      </Header>
      {stories.length ?
        <Card.Group>
          {stories.map(s => (
            <StoryCard firebase={firebase} key={s.id} story={s} canJoin={true} />
          ))}
        </Card.Group>
        :
        <Message color={'black'}>
          <Message.Header>No stories to vote on</Message.Header>
          <p>
            When stories from this team are available to vote on, they will appear here. You need to create an account to add stories.
          </p>
        </Message>
      }
      <Header as='h2' dividing>
        Stories with all voters registered
      </Header>
      {fullStories.length ?
        <Card.Group>
          {fullStories.map(s => (
            <StoryCard firebase={firebase} key={s.id} story={s} canJoin={false} />
          ))}
        </Card.Group>
        :
        <Message color={'black'}>
          <Message.Header>No stories fully registered</Message.Header>
          <p>
            Stories from this team with all voters registered will appear here.
          </p>
        </Message>

      }

    </Segment>
  );
}

const TeamStories = compose(
  withFirebase
)(Team);

export default TeamStories
