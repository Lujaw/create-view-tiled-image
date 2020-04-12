import React, { Component } from 'react';
import ReactMapboxGl, { Layer, ZoomControl } from 'react-mapbox-gl';
import './App.css';

const Map = ReactMapboxGl({});

class App extends Component {
  state = {
    response: '',
    post: '',
    responseToPost: '',
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

  render() {
    return (
      <div className="App">
        <header className="App-header" />
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
    );
  }
}

export default App;