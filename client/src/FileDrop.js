import React, { Component } from 'react';
import { DropzoneDialog } from 'material-ui-dropzone';
import Button from '@material-ui/core/Button';

export default class FileDrop extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      files: []
    };
    // this.props.uploadFile.bind(this);
  }

  handleClose() {
    this.setState({
      open: false
    });
  }

  handleSave(files) {
    //Saving files to state for further use and closing Modal.
    this.setState({
      files: files,
      open: false
    });
    console.log('FileDrop#22->>>', { state: this.state, prop: this.props });
    this.props.uploadFile(files);
    console.log('FileDrop#23->>>', { state: this.state, prop: this.props });
  }

  handleOpen() {
    this.setState({
      open: true,
    });
  }

  render() {
    return (
      <div>
        <Button onClick={this.handleOpen.bind(this)}>
          Upload Image
                </Button>
        <DropzoneDialog
          open={this.state.open}
          onSave={this.handleSave.bind(this)}
          uploadFile={this.props.uploadFile}
          acceptedFiles={['image/jpeg']}
          showPreviews={true}
          maxFileSize={5000000}
          onClose={this.handleClose.bind(this)}
        />
      </div>
    );
  }
}