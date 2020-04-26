import React from 'react';
import { withFirebase } from '../Firebase';
import { Button } from 'semantic-ui-react'

const SignOutButton = ({ firebase }) => (
  <Button onClick={firebase.doSignOut}>Sign out</Button>
);

export default withFirebase(SignOutButton);
