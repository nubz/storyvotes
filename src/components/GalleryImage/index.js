import { Button, Image, List, Segment, TransitionablePortal } from 'semantic-ui-react';
import React, { useState } from 'react'
import styles from '../../styles'

const GalleryImage = props => {
  const { photo } = props;
  const [photoIsOpen, setPhotoIsOpen ] = useState(false);
  const closePhoto = e => {
    setPhotoIsOpen(false)
  };
  const openPhoto = e => (
    setPhotoIsOpen(true)
  );
  const isVideo = name => {
    return name.toLowerCase().indexOf('.mov') !== -1 ||
      name.toLowerCase().indexOf('.mp4') !== -1 ||
      name.toLowerCase().indexOf('.mpeg') !== -1
  };

  const bgImageStyles = {...styles.bgImage, backgroundImage: `url(${photo})`};

  return (
    <List.Item key={photo}>
      {isVideo(photo) ?
        <div>
          <Image
            as={'a'}
            onClick={openPhoto}
            src={'/assets/images/video-placeholder.jpg'}
            size={'tiny'} />
          <TransitionablePortal
            onClose={closePhoto}
            open={photoIsOpen}
          >
          <Segment style={styles.fullScreen}>
            <Button icon='close' floated={'right'} color={'red'} onClick={closePhoto} />
            <video
              controls="controls"
              style={{objectFit: 'contain'}}
              width="100%"
              height="100%"
              src={photo} />
            </Segment>
          </TransitionablePortal>
        </div>
        :
        <div>
          <Image
            as={'a'}
            onClick={openPhoto}
            src={photo}
            size='tiny'/>
          <TransitionablePortal
            onClose={closePhoto}
            open={photoIsOpen}
          >
            <Segment style={bgImageStyles}>
              <Button icon='close' floated={'right'} color={'red'} onClick={closePhoto} />
            </Segment>
          </TransitionablePortal>
        </div>
      }
    </List.Item>
  )
};

export default GalleryImage
