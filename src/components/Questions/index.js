import React, { useState, useEffect } from 'react'
import { compose } from 'recompose';
import { withFirebase } from '../Firebase';
import { withRouter } from 'react-router-dom'
import { withAuthUser, withAuthorization } from '../Session';
import { Accordion, Button, Input, Icon, List, Container } from 'semantic-ui-react'
import Utils from '../Utils';
const unescape = require('he').decode

const MyQuestions = props => {
  const { authUser, firebase, history } = props;
  const [ questions, setQuestions ] = useState([]);
  const [ question, setQuestion ] = useState('');
  const [ correct, setCorrect ] = useState('')
  const [ answerB, setAnswerB ] = useState('')
  const [ answerC, setAnswerC ] = useState('')
  const [ answerD, setAnswerD ] = useState('')
  const [ accordionOpen, setAccordionOpen ] = useState(false)
  const [ batch, setBatch ] = useState('')
  const questionsPath = "questions/" + authUser.uid

  useEffect(() => {
    const qRef = firebase.db.ref(questionsPath);
    const qListener = qRef
      .on("value", snapshot => {
        const items = Utils.firebaseToArrayWithKey(snapshot.val());
        setQuestions(items);
      });

    return () => {
      qRef.off("value", qListener);
    }
  }, [firebase, questionsPath]);

  async function addQuestion (e) {
    e.preventDefault();
    await firebase.db.ref(questionsPath).push({
      question: question,
      correct: correct,
      answerB: answerB,
      answerC: answerC,
      answerD: answerD,
    });
    setQuestion("")
    setCorrect("")
    setAnswerB("")
    setAnswerC("")
    setAnswerD("")
  }

  const parsed = batch => JSON.parse(batch)
    .reduce((list, next) => {
      const correct = next.answers.find(a => a.correct === true)
      const wrongAnswers = next.answers.filter(a => a.correct === false)
      const q = {}
      q.question = unescape(next.text)
      q.correct = unescape(correct.text)
      q.answerB = unescape(wrongAnswers[0].text)
      q.answerC = unescape(wrongAnswers[1].text)
      q.answerD = unescape(wrongAnswers[2].text)
      q.tags = ['Animals']
      list.push(q)
      return list
    }, [])

  const addBatch = async function () {
    await parsed(batch).forEach(p => {
      firebase.db.ref('questions/public').push(p)
    })
    setBatch('')
  }


  const removeQuestion = id => () => {
    firebase.db
      .ref(questionsPath)
      .child(id)
      .remove()
      .then(() => console.log('removed ' + id), err => console.error(err))
  };

  const manageQuestion = id => () => {
    history.push('questionAdmin/' + id)
  }

  const onChange = setter => event => {
    setter(event.target.value);
  };

  const toggleAccordion = () => {
    const newState = !accordionOpen
    setAccordionOpen(newState)
  }

  const invalidQuizForm = question.length < 3 &&
    correct.length < 1 &&
    answerB.length < 1 &&
    answerC.length < 1 &&
    answerD.length < 1

  const newBatchForm = () => {
    return (
      <>
        <textarea name={'batch'} style={{width: '100%', height: '100px', display: 'block'}} onChange={onChange(setBatch)} value={batch} />
        <Button onClick={addBatch}>Add batch</Button>
      </>
    )
  }

  return (
    <Container className={'page'}>
      <h1>My questions</h1>
      {newBatchForm()}
      <Accordion>
        <Accordion.Title
          active={accordionOpen}
          index={0}
          onClick={toggleAccordion}
          style={{color: 'white'}}
        >
          <Icon name='question circle outline' />
          Add a new question
        </Accordion.Title>
        <Accordion.Content active={accordionOpen}>
          <form onSubmit={addQuestion} className={'questionForm'} style={{marginBottom: '3em'}}>
            <h2>New question</h2>
            <Input
              iconPosition="left"
              name="question"
              type="text"
              value={question}
              onChange={onChange(setQuestion)}
              placeholder="What's the question"
              style={{marginBottom: '1em'}}
            >
              <Icon name="question circle"/>
              <input autoComplete="off"/>
            </Input>
            <h2>Correct answer</h2>
            <Input
              iconPosition="left"
              name="answerA"
              type="text"
              value={correct}
              onChange={onChange(setCorrect)}
              placeholder="Correct answer"
              style={{marginBottom: '1em'}}
            >
              <Icon name={'check circle'}/>
              <input autoComplete="off"/>
            </Input>
            <h2>Wrong answers</h2>
            <Input
              iconPosition="left"
              name="answerB"
              type="text"
              value={answerB}
              onChange={onChange(setAnswerB)}
              placeholder="A wrong answer"
              style={{marginBottom: '1em'}}
            >
              <Icon name={'close'}/>
              <input autoComplete="off"/>
            </Input>
            <Input
              iconPosition="left"
              name="answerC"
              type="text"
              value={answerC}
              onChange={onChange(setAnswerC)}
              placeholder="A wrong answer"
              style={{marginBottom: '1em'}}
            >
              <Icon name={'close'}/>
              <input autoComplete="off"/>
            </Input>
            <Input
              iconPosition="left"
              name="answerD"
              type="text"
              value={answerD}
              onChange={onChange(setAnswerD)}
              placeholder="A wrong answer"
              style={{marginBottom: '1em'}}
            >
              <Icon name={'close'}/>
              <input autoComplete="off"/>
            </Input>
            <Button disabled={invalidQuizForm}>
              Add new question
            </Button>
          </form>
        </Accordion.Content>
      </Accordion>

      {questions ?
        <List divided relaxed inverted>
          {
            questions.map(q => (
              <List.Item key={q.id}>
                <List.Content floated='right'>
                  <Button size={'mini'} onClick={manageQuestion(q.id)}>Manage</Button>
                  <Button size={'mini'} onClick={removeQuestion(q.id)}>Delete</Button>
                </List.Content>
                <List.Icon name='question circle outline' size='large' verticalAlign='middle' />
                <List.Content>
                  <List.Header>{q.question}</List.Header>
                </List.Content>
              </List.Item>
            ))
          }
        </List>: null
      }
    </Container>
  )
}


const condition = authUser => !!authUser;

const Questions = compose(
  withFirebase,
  withAuthUser,
  withRouter
)(MyQuestions);

export default withAuthorization(condition)(Questions);
