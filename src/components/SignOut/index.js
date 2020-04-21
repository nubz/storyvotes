import React from 'react';
import { withFirebase } from '../Firebase';

// Q: How do you pass props here?
const SignOutButton = ({ firebase }) => (
  <button className={`c-btn f2 f3-handLg mt4 c-btn--secondary--dminished`} onClick={firebase.doSignOut}>Sign out</button>
);

export default withFirebase(SignOutButton);
