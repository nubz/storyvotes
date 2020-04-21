import React from 'react';
import { compose } from 'recompose';
import { withFirebase } from '../Firebase';
import { withAuthorization } from '../Session';

class FileInput extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.fileInput = React.createRef();
  }
  handleSubmit(event) {
    event.preventDefault();
    const { firebase, folder, handler } = this.props;
    const photo = this.fileInput.current.files[0];
    const storageRef = firebase.storage().ref();
    const photoRef = storageRef.child('images/' + folder + '/' + photo.name);
    const uploadTask = photoRef.put(photo);
    uploadTask.on('state_changed', snapshot => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('Upload is ' + progress + '% done');
      switch (snapshot.state) {
        case firebase.storage.TaskState.PAUSED:
          console.log('Upload is paused');
          break;
        case firebase.storage.TaskState.RUNNING:
          console.log('Upload is running');
          break;
        default:
          console.log('Upload state is unknown');
          break;
      }
    }, error => {
      console.error(error)
    }, () => {
      uploadTask.snapshot.ref.getDownloadURL().then(handler);
    });
  }

  render() {
    return (
      <div className={"uploader-wrapper"}>
        <input className={"uploader"} type="file" ref={this.fileInput} onChange={this.handleSubmit}/>
      </div>
    );
  }
}

const condition = authUser => !!authUser;

const Uploader = compose(
  withFirebase,
)(FileInput);

export default withAuthorization(condition)(Uploader);