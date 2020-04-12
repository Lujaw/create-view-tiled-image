import React, { Component } from 'react';
import ReactMapboxGl, { Layer, ZoomControl } from 'react-mapbox-gl';
import FileDrop from "./FileDrop";
import './App.css';

const Map = ReactMapboxGl({});

class App extends Component {
  state = {
    images: []
  };

  style = {
    "version": 8,
    "sources": {
      "image_tiles": {
        "type": "raster",
        "tiles": [
          "http://localhost:3000/assets/cat/{z}/{x}_{y}.jpg",
        ],
        "tileSize": 256,
        "maxzoom": 3,
      }
    },
    "layers": [{
      "id": "simple-tiles",
      "type": "raster",
      "source": "image_tiles"
    }]
  };

  componentDidMount() {
    this.callApi("/listImages")
      .then((res) => this.setState({ images: res.images }))
      .catch(err => console.log(err));
  }

  callApi = async (url) => {
    const response = await fetch("/listImages");
    const body = await response.json();
    console.log('App#41->>>', { body });
    if (response.status !== 200) throw Error(body.message);
    return body;
  };


  sendRequest(file) {
    return new Promise((resolve, reject) => {
      const req = new XMLHttpRequest();

      const formData = new FormData();
      formData.append("image", file, file.name);

      req.open("POST", "http://localhost:5000/upload");
      req.send(formData);
    });
  }

  async uploadFile(files) {
    console.log('App#60->>> upload called', { files, state: this.state, props: this.props });
    // this.setState({ uploadProgress: {}, uploading: true });
    const promises = [];
    files.forEach(file => {
      promises.push(this.sendRequest(file));
    });
    try {
      const uploads = await Promise.all(promises);
      console.log('App#68->>>', { uploads });

      this.setState({ successfullUploaded: true, uploading: false });
    } catch (e) {
      console.log('App#71->>>', { e });
      // Not Production ready! Do some error handling here instead...
      this.setState({ successfullUploaded: true, uploading: false });
    }
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">Tiled Image Viewer</header>
        <div className="map-container">
          <Map
            style={this.style}
            zoom={[0]}
            maxzoom={2}
            containerStyle={{
              height: '50vh',
              width: '75vw'
            }} >
            <Layer type="raster" id="layer_id" sourceId="image_tiles" />
            <ZoomControl />
          </Map >
        </div>
        {1 && this.state.images.map(image =>
          <button key={image}>{image}</button>
        )}
        <FileDrop uploadFile={this.uploadFile.bind(this)} />

      </div>
    );
  }
}

export default App;