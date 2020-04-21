import React, { useContext, useState } from 'react'
import { slide as Menu } from 'react-burger-menu'
import * as ROUTES from '../../constants/routes'
import { Link } from 'react-router-dom'
import SignOutButton from '../SignOut'
import Avatar from '../Avatar'

const SidebarContext = React.createContext();

const SidebarProvider = (props) => {
  const [menuOpenState, setMenuOpenState] = useState(false)

  return (
    <SidebarContext.Provider value={{
      isMenuOpen: menuOpenState,
      toggleMenu: () => setMenuOpenState(!menuOpenState),
      stateChangeHandler: (newState) => setMenuOpenState(newState.isOpen)
    }}>
      {props.children}
    </SidebarContext.Provider>
  )
}

const SideBar = props => {
  const { authUser, routes } = props
  const ctx = useContext(SidebarContext)
  return (
    <Menu
      right
      isOpen={ctx.isMenuOpen}
      onStateChange={(state) => ctx.stateChangeHandler(state)}
      style={{marginTop: '2em'}}>
      {authUser && authUser.uid ? <Avatar size={'tiny'} id={authUser.uid} /> : null}
      {routes ?
      routes.map(r => (
        <Link
          key={r.route}
          className={'menu-item'}
          onClick={ ctx.toggleMenu }
          to={ROUTES[r.route]}
          style={{ color: r.color, marginTop: '1em', paddingBottom: '1em', borderBottom: '1px solid #777'}}>
          {r.label}
        </Link>
      )) : null}
      {authUser ? <SignOutButton name={authUser.email} onClick={ctx.toggleMenu}/> : null }
    </Menu>
  );
};

const SidebarWithContext = props => {
  return (
    <SidebarProvider>
      <SideBar {...props} />
    </SidebarProvider>
  )
}

export default SidebarWithContext
