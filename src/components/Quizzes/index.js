import React, { useState, useEffect } from 'react'
import { compose } from 'recompose';
import { withFirebase } from '../Firebase';
import { withRouter } from 'react-router-dom'
import { withAuthUser, withAuthorization } from '../Session';
import { Button, Input, Icon, List } from 'semantic-ui-react';
import Utils from '../Utils';

const MyQuizzes = props => {
  const { authUser, firebase, history } = props;
  const [ quizzes, setQuizzes ] = useState([]);
  const [ nameInput, setNameInput ] = useState("");
  const quizzesPath = "quizzes/" + authUser.uid

  useEffect(() => {
    const quizzesRef = firebase.db.ref(quizzesPath);
    const quizzesListener = quizzesRef
      .on("value", snapshot => {
        const items = Utils.firebaseToArrayWithKey(snapshot.val());
        setQuizzes(items);
      });

    return () => {
      quizzesRef.off("value", quizzesListener);
    }
  }, [firebase, quizzesPath]);

  async function addQuiz (e) {
    e.preventDefault();
    await firebase.db.ref(quizzesPath).push({
      name: nameInput
    });
    setNameInput("")
  }

  const removeQuiz = id => () => {
    firebase.db
      .ref(quizzesPath)
      .child(id)
      .remove()
      .then(() => console.log('removed ' + id), err => console.error(err))
  };

  const manageQuiz = id => () => {
    history.push('quiz/' + id)
  }

  const onNameChange = event => {
    setNameInput(event.target.value);
  };

  const invalidQuizForm = nameInput.length < 2;

  return (
    <>
      <form onSubmit={addQuiz} style={{marginBottom: '3em'}}>
        <Input
          iconPosition="left"
          name="name"
          type="text"
          value={nameInput}
          onChange={onNameChange}
          placeholder="Name of new quiz"
          style={{marginBottom: '1em'}}
        >
          <Icon name="question circle"/>
          <input autoComplete="off"/>
        </Input>
       <Button disabled={invalidQuizForm}>
          Add new quiz
        </Button>
      </form>
      {quizzes ?
        <List divided relaxed inverted>
          {
            quizzes.map(q => (
              <List.Item key={q.id}>
                <List.Content floated='right'>
                  <Button size={'mini'} onClick={manageQuiz(q.id)}>Manage</Button>
                  <Button size={'mini'} onClick={removeQuiz(q.id)}>Delete</Button>
                </List.Content>
                <List.Icon name='question circle outline' size='large' verticalAlign='middle' />
                <List.Content>
                  <List.Header>{q.name}</List.Header>
                </List.Content>
              </List.Item>
            ))
          }
        </List>: null
      }
    </>
  )
}


const condition = authUser => !!authUser;

const Quizzes = compose(
  withFirebase,
  withAuthUser,
  withRouter
)(MyQuizzes);

export default withAuthorization(condition)(Quizzes);
