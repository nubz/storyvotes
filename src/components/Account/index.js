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
  const [ profile, setProfile ] = useState({id: '', username: 'Guest', email: 'guest', avatar: ''});
  const { authUser, firebase } = props;
  const profilePath = 'profiles/' + authUser.uid
  useEffect(() => {
    const profileRef = firebase.db
      .ref(profilePath);
    const profileListener = profileRef
      .on("value", snapshot => {
        const item = snapshot.val();
        item.id = item.key
        setProfile(item)
      });

    return () => {
      profileRef.off("value", profileListener)
    }
  }, [authUser, firebase, profilePath]);

  const handlePhotoUpload = downloadUrl => {
    const pRef = firebase.db.ref(profilePath);
    return pRef.update({avatar: downloadUrl})
  };

  return (
    <Segment padded className={'withMenu'}>
      <Header as={'h1'}>Account details</Header>
      {profile.username ? <p>{profile.username}</p> : null}
      <p>Email: {authUser.email}</p>
      <Header as={'h2'}>Change your avatar</Header>
      {profile.avatar ? <Gallery photos={[profile.avatar]} /> : null}
      <Uploader folder={authUser.uid} handler={handlePhotoUpload} />
      <Header as={'h2'}>Change your password</Header>
      <PasswordChangeForm />
      <SignOutButton />
    </Segment>
  )
};

const condition = authUser => !!authUser;
const Account = compose(
  withFirebase,
)(AccountPage);

export default withAuthorization(condition)(Account);
