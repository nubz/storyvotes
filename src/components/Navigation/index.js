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
    color: 'white',
    icon: 'plus circle'
  },
  {
    route: 'HOME',
    label: 'My stories',
    color: 'white',
    icon: 'folder open'
  },
  {
    route: 'ACCOUNT',
    label: 'Account',
    color: 'white',
    icon: 'user'
  }
];

const unAuthRoutes = [
  {
    route: 'SIGN_IN',
    label: 'Sign in',
    icon: 'lock'
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
          StoryVotes
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
