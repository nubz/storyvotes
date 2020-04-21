import React from 'react'
import { AuthUserContext, withAuthorization } from '../Session';
import { Segment } from 'semantic-ui-react';
import { compose } from 'recompose';
import { withFirebase } from '../Firebase';

import Quizzes from '../Quizzes'

const HomePageView = props => (
  <AuthUserContext.Consumer>
    {authUser => (
      <HomePage authUser={authUser} {...props}/>
    )}
  </AuthUserContext.Consumer>
);

const HomePage = props => {
  return (
    <div>
      <Segment padded>
        <h1>My quizzes</h1>
        <Quizzes />
      </Segment>
    </div>
  );
};

const condition = authUser => !!authUser;

const Home = compose(
  withFirebase,
)(HomePageView);

export default withAuthorization(condition)(Home);
