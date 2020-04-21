import React from 'react'
import { Container } from 'semantic-ui-react'
import { Link } from 'react-router-dom';
import SideBar from '../Sidebar';
import * as ROUTES from '../../constants/routes';
import { AuthUserContext } from '../Session';

const authRoutes = [
  {
    route: 'STORY',
    label: 'Add a story',
    color: 'white'
  },
  {
    route: 'ACCOUNT',
    label: 'Account',
    color: 'white'
  }
];

const unAuthRoutes = [
  {
    route: 'SIGN_IN',
    label: 'Sign in'
  }
];


const NavigationBar = props => {
  const { authUser } = props
  const routes = authUser ? authRoutes : unAuthRoutes
  return (
    <div className={'navbar'}>
      <SideBar authUser={authUser} routes={routes} />
      <Container>
        <Link className={'logo'} to={ROUTES.LANDING}>
          Quizzy
        </Link>
      </Container>
    </div>
  )
}

const Navigation = () => {
  return (
    <div>
      <AuthUserContext.Consumer>
        { authUser => <NavigationBar authUser={authUser} /> }
      </AuthUserContext.Consumer>
    </div>
  )
};

export default Navigation;
