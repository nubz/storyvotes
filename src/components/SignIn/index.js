import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import { SignUpLink } from '../SignUp';
import { PasswordForgetLink } from '../PasswordForget';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import { Icon, Input, Button, Segment, Message } from 'semantic-ui-react';

const SignInPage = () => (
  <Segment padded className={'withMenu'}>
    <h1>Sign in</h1>
    <SignInForm />
    <PasswordForgetLink />
    <SignUpLink />
  </Segment>
);

const SignInFormBase = props => {
  const { firebase, history } = props;
  const [ email, setEmail ] = useState('')
  const [ password, setPassword ] = useState('')
  const [ err, setErr ] = useState(null)

  const onSubmit = event => {

    firebase
      .doSignInWithEmailAndPassword(email, password)
      .then(() => {
        setEmail('');
        setPassword('');
        setErr(null);
        history.push(ROUTES.HOME);
      })
      .catch(error => {
        setErr(error);
      });

    event.preventDefault();
  };

  const onChangePassword = event => {
    setPassword(event.target.value)
  };

  const onChangeEmail = event => {
    setEmail(event.target.value)
  };

  const isInvalid = password === '' || email === '';

  return (
    <form onSubmit={onSubmit}>
      <Input
        iconPosition='left'
        name="email"
        value={email}
        onChange={onChangeEmail}
        type="text"
        placeholder="Email Address"
      >
        <Icon name='at' />
        <input />
      </Input><br /><br />
      <Input
        iconPosition='left'
        name="password"
        value={password}
        onChange={onChangePassword}
        type="password"
        placeholder="Password"
      >
        <Icon name='protect' />
        <input />
      </Input><br /><br />
      <Button primary disabled={isInvalid} type="submit">
        Sign In
      </Button>

      {err &&
      <Message negative>
        <Message.Header>Something is wrong</Message.Header>
        <p>{err.message}</p>
      </Message>}
    </form>
  );
}


const SignInForm = compose(
  withRouter,
  withFirebase,
)(SignInFormBase);

export default SignInPage;

export { SignInForm };
