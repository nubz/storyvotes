import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Navigation from '../Navigation';
import Footer from '../Navigation/footer'
import LandingPage from '../Landing';
import SignUpPage from '../SignUp';
import SignInPage from '../SignIn';
import PasswordForgetPage from '../PasswordForget';
import Home from '../Home';
import AccountPage from '../Account';
import Vote from '../Vote'
import Story from '../Story'
import Team from '../Team'
import Teams from '../Teams'
import NewTeam from '../TeamCreate'
import TeamEdit from '../TeamCreate/edit.js'
import * as ROUTES from '../../constants/routes';
import { withAuthentication } from '../Session';
import { Container } from 'semantic-ui-react'

import 'semantic-ui-css/semantic.min.css';

const App = () => (
  <Router onUpdate={() => window.scrollTo(0, 0)}>
    <Navigation />
    <Container>
      <Route exact path={ROUTES.LANDING} component={LandingPage}/>
      <Route path={ROUTES.SIGN_UP} component={SignUpPage}/>
      <Route path={ROUTES.SIGN_IN} component={SignInPage}/>
      <Route path={ROUTES.PASSWORD_FORGET} component={PasswordForgetPage}/>
      <Route path={ROUTES.HOME} component={Home}/>
      <Route path={ROUTES.ACCOUNT} component={AccountPage}/>
      <Route path={ROUTES.VOTE} component={Vote}/>
      <Route path={ROUTES.STORY} component={Story}/>
      <Route exact path={ROUTES.TEAM} component={Team}/>
      <Route path={ROUTES.NEW_TEAM} component={NewTeam}/>
      <Route path={ROUTES.TEAM_EDIT} component={TeamEdit} />
      <Route exact path={ROUTES.TEAMS} component={Teams}/>
    </Container>
    <Footer />
  </Router>
);

export default withAuthentication(App);
