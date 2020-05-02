import React from 'react'
import { Menu, Responsive, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import { AuthUserContext } from '../Session';

const authRoutes = [
  {
    route: 'STORY',
    label: 'Add a story',
    color: '#0bc986',
    icon: 'plus circle'
  },
  {
    route: 'TEAMS',
    label: 'My teams',
    color: 'grey',
    icon: 'users'
  },
  {
    route: 'ACCOUNT',
    label: 'Account',
    color: 'grey',
    icon: 'user'
  }
];

const unAuthRoutes = [
  {
    route: 'SIGN_IN',
    label: 'Sign in',
    icon: 'lock',
    color: 'grey'
  }
];

const FooterNavigation = props => {
  const { authUser } = props
  const routes = authUser ? authRoutes : unAuthRoutes
  return (
    <Responsive as={Menu} className={'footer-menu'} style={{backgroundColor: 'black', maxHeight: '6em', maxWidth: '100vw'}} icon='labeled' fluid widths={6} fixed='bottom'>
      { routes.length ? routes.map(r => (
          <Menu.Item key={r.route} className={'footer-item'}>
            <Link to={ROUTES[r.route]} style={{color: r.color}}>
              <Icon name={r.icon} />
            </Link>
          </Menu.Item>
        )
      ) : null}
    </Responsive>
  )
}


const Footer = () => {
  return (
    <div>
      <AuthUserContext.Consumer>
        { authUser => <FooterNavigation authUser={authUser} /> }
      </AuthUserContext.Consumer>
    </div>
  )
};

export default Footer;
