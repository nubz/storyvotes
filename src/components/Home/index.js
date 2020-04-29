import React, { useEffect, useState } from 'react'
import { AuthUserContext, withAuthorization } from '../Session'
import { Button, List, Message, Segment } from 'semantic-ui-react'
import { compose } from 'recompose'
import { withFirebase } from '../Firebase'
import Utils from '../Utils'
import * as ROUTES from '../../constants/routes'
import { Link } from 'react-router-dom'

const HomePageView = props => (
  <AuthUserContext.Consumer>
    {authUser => (
      <HomePage authUser={authUser} {...props}/>
    )}
  </AuthUserContext.Consumer>
);

const HomePage = props => {
  const { authUser, firebase } = props
  const [ myStories, setMyStories ] = useState([])
  useEffect(() => {
    const storyListRef = firebase.db.ref('stories/')
    const storyListener = storyListRef
      .on("value", snapshot => {
        const myTeamStories = []
        snapshot.forEach(childSnapshot => {
          const teamStories = Utils.firebaseToArrayWithKey(childSnapshot.val())
          teamStories.forEach(story => {
            if (story.owner === authUser.uid) {
              myTeamStories.push(story)
            }
          })
        })

        setMyStories(myTeamStories)
      })

    return () => {
      storyListRef.off("value", storyListener)
    }
  }, [ authUser, firebase ])

  const removeStory = (teamId, id) => () => {
    firebase.db
      .ref('stories/' + teamId)
      .child(id)
      .remove()
      .then(
        () => firebase.db
          .ref('submissions/')
          .child(id)
          .remove()
          .then(
            () => console.log('removed all submissions'),
            err => console.error(err)),
        err => console.error(err))
  }

  return (
    <div>
      <Segment padded>
        <h1>My stories</h1>
        <p>Stories you can view or delete.</p>
        <p>
          <a href={ROUTES.STORY}>Add a story</a>
        </p>
        {myStories.length ?
          <List divided relaxed inverted>
            {
              myStories.map(story => (
                <List.Item key={story.id}>
                  <List.Content floated='right'>
                    <Button icon={'delete'} size={'mini'} onClick={removeStory(story.teamId, story.id)}/>
                  </List.Content>
                  <List.Icon name='file outline' size='large' verticalAlign='middle' />
                  <List.Content>
                    <List.Header>
                      <Link to={`vote/${story.teamId}/${story.id}`}>{story.name}</Link>
                    </List.Header>
                  </List.Content>
                </List.Item>
              ))
            }
          </List>:
          <Message>
            <Message.Header>You have no stories</Message.Header>
            <p>
              <a href={ROUTES.STORY}>Add a story</a>
            </p>
          </Message>
        }
      </Segment>
    </div>
  );
};

const condition = authUser => !!authUser;

const Home = compose(
  withFirebase
)(HomePageView);

export default withAuthorization(condition)(Home);
