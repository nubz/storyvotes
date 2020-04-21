import React, { useState, useEffect } from 'react';
import { compose } from 'recompose';
import { withFirebase } from '../Firebase';
import { Button, Header, Image, Segment, TransitionablePortal } from 'semantic-ui-react';
import styles from '../../styles';
import TurnLogs from '../TurnLogs';
import Wallet from '../Wallet';

const ProfileBase = props => {
  const [ profile, setProfile ] = useState({});
  const { firebase, email, size, withName = false, nonExpandable, selected = false } = props;
  const [ opacity, setOpacity ] = useState(1);
  const [ openTurnHistory, setOpenTurnHistory ] = useState(false);

  const openTurnHistoryWindow = e => {
    e.preventDefault();
    if (nonExpandable) {
      return false;
    }
    setOpenTurnHistory(true)
  };
  const closeTurnHistory = () => {
    setOpenTurnHistory(false)
  };
  useEffect(() => {
    setOpacity(selected ? 1 : 0.4);
    const emailToUse = email || '';
    const profileRef = firebase.db
      .ref('profiles');
    const profileListener = profileRef
      .orderByChild('email')
      .equalTo(emailToUse)
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
  }, [email, firebase, selected]);

  return (
    <div>
      <Image
        onClick={openTurnHistoryWindow}
        alt={'Avatar for ' + profile.username}
        style={{display: 'inline-block', marginRight: '0.5em', opacity: opacity, border: '2px solid white'}}
        src={profile.avatar ? profile.avatar : '/assets/images/default-avatar.png'}
        circular
        size={size}/>

      {withName ? <Header as={'h4'} size={'small'} style={{display: 'inline-block', marginTop: "10px", paddingLeft: "0.5em", color: "white"}}>{profile.username}</Header> : null}
      <TransitionablePortal
        onClose={closeTurnHistory}
        open={openTurnHistory}
      >
        <Segment className={'today'} style={styles.profileStyles}>
          <Button icon='close' style={styles.modalCloseButton} color={'red'} onClick={closeTurnHistory} />
          <Image
            onClick={openTurnHistoryWindow}
            alt={'Avatar for ' + profile.username}
            style={{display: 'block', margin: '10px auto', maxWidth: '66%', border: '6px solid white'}}
            src={profile.avatar ? profile.avatar : '/assets/images/default-avatar.png'}
            circular
            size={'medium'}/>
          <Header as={'h3'} className={'c-tertiary-heading'}>{profile.username}</Header>
          <div><Wallet email={profile.email} fontSize={"20px"} /> credits earned</div>
          <TurnLogs id={profile.email} idType={'contractor'}/>
        </Segment>
      </TransitionablePortal>
    </div>
  )
};

const Profile = compose(
  withFirebase
)(ProfileBase);

export default Profile;
