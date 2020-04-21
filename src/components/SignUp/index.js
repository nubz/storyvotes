import React, { useState } from 'react'
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { withFirebase } from '../Firebase';
import {
  Icon,
  Input,
  Button,
  Segment,
  Grid,
  Form,
  Header,
  Message } from 'semantic-ui-react';

import * as ROUTES from '../../constants/routes';

const INITIAL_STATE = {
  username: '',
  email: '',
  passwordOne: '',
  passwordTwo: '',
  error: null,
  submitted: false,
  avatar: ''
};

const SignUpPage = () => (
  <Segment padded>
    <SignUpForm />
  </Segment>
);

const SignUpAction = props => {
  const { firebase, history } = props
  const [state, setState ] = useState(INITIAL_STATE)

  const onSubmit = event => {
    const { email, passwordOne, username, avatar } = state

    setState({...state, submitted: true});

    firebase
      .doCreateUserWithEmailAndPassword(email, passwordOne)
      .then(result => {
        return setTimeout(() => firebase.db
          .ref('profiles/' + result.user.uid)
          .set({
            username: username,
            email: email,
            avatar: avatar
          }).then(() => {
            history.push(ROUTES.QUIZ);
          }), 1000)
      })
      .catch(error => {
        setState({ ...state, error })
      });

    event.preventDefault()
  }

  const onChange = event => {
    setState({ ...state, [event.target.name]: event.target.value })
  }

  const isInvalid =
    state.passwordOne !== state.passwordTwo ||
    state.passwordOne === '' ||
    state.email === '' ||
    state.username === ''

  return (
    <Grid textAlign="center" verticalAlign="middle">
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as="h2" textAlign="center">
          Sign up for an account
        </Header>
        <Form size="large" onSubmit={onSubmit}>
          <Segment stacked>
            <Input
              iconPosition={'left'}
              name="username"
              value={state.username}
              onChange={onChange}
              type="text"
              placeholder="Full Name"
            >
              <Icon name='user outline' />
              <input />
            </Input><br /><br />
            <Input
              iconPosition='left'
              name="email"
              value={state.email}
              onChange={onChange}
              type="text"
              placeholder="Email Address">
              <Icon name='at' />
              <input />
            </Input><br /><br />
            <Input
              iconPosition='left'
              name="passwordOne"
              value={state.passwordOne}
              onChange={onChange}
              type="password"
              placeholder="Password"
            >
              <Icon name='protect' />
              <input />
            </Input><br /><br />
            <Input
              name="passwordTwo"
              iconPosition='left'
              value={state.passwordTwo}
              onChange={onChange}
              type="password"
              placeholder="Confirm Password"
            >
              <Icon name='protect' />
              <input />
            </Input><br /><br />
            {!state.submitted ?
              <Button fluid size="large" disabled={isInvalid}>
                Sign Up
              </Button>
              : <div>Signing you up...</div>}

          </Segment>
        </Form>

        {state.error && <Message><p>{state.error.message}</p></Message>}

      </Grid.Column>
    </Grid>
  )

}

const SignUpLink = () => (
  <p>
    Don't have an account? <Link to={ROUTES.SIGN_UP}>Sign Up</Link>
  </p>
);

export default SignUpPage;

const SignUpForm = compose(
  withRouter,
  withFirebase,
)(SignUpAction);

export { SignUpForm, SignUpLink };
