import React, { useState, useEffect } from 'react';
import PasswordChangeForm from '../PasswordChange';
import { AuthUserContext, withAuthorization } from '../Session';
import { Header, Segment } from 'semantic-ui-react';
import Uploader from '../Uploader';
import Gallery from '../Gallery';
import { compose } from 'recompose';
import { withFirebase } from '../Firebase';
import SignOutButton from '../SignOut';

const AccountPage = props => (
  <AuthUserContext.Consumer>
    {authUser => (
      <AccountForm authUser={authUser} {...props} />
    )}
  </AuthUserContext.Consumer>
);

const AccountForm = props => {
  const [ profile, setProfile ] = useState({username: 'Guest', email: 'guest', avatar: ''});
  const { authUser, firebase } = props;
  useEffect(() => {
    const profileRef = firebase.db
      .ref('profiles');
    const profileListener = profileRef
      .orderByChild('email')
      .equalTo(authUser.email)
      .on("value", snapshot => {
        const matches = snapshot.val();
        for(let item in matches) {
          const newProfile = matches[item];
          newProfile.id = item;
          setProfile(newProfile)
        }
      });

    return () => {
      profileRef.off("value", profileListener)
    }
  }, [authUser, firebase]);

  const handlePhotoUpload = id => (downloadUrl) => {
    const pRef = firebase.db.ref('profiles');
    return pRef.child(id).update({avatar: downloadUrl})
  };

  return (
    <Segment padded className={'withMenu'}>
      <Header as={'h1'}>Account details</Header>
      {profile.username ? <p>{profile.username}</p> : null}
      <p>Email: {authUser.email}</p>
      <Header as={'h2'}>Change your avatar</Header>
      <Uploader folder={authUser.email} handler={handlePhotoUpload(profile.id)} />
      {profile.avatar ? <Gallery photos={[profile.avatar]} /> : null}
      <Header as={'h2'}>Change your password</Header>
      <PasswordChangeForm />
      <Header as={'h3'}>Sign out <SignOutButton /></Header>
    </Segment>
  )
};

const condition = authUser => !!authUser;
const Account = compose(
  withFirebase,
)(AccountPage);

export default withAuthorization(condition)(Account);
