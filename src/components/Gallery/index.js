import React from 'react'
import { List } from 'semantic-ui-react';
import GalleryImage from '../GalleryImage';

const Gallery = props => {
  const { photos } = props;

  return (
    <List horizontal>
      {photos.length ? photos.map(photo => (
        <GalleryImage
          key={'gallery-' + photo}
          photo={photo} />
      )) : null}
    </List>
  )
};

export default Gallery
