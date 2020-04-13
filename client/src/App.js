import React, { Component } from "react";
import ReactMapboxGl, { Layer, ZoomControl } from "react-mapbox-gl";
import Carousel from "nuka-carousel";
import FileDrop from "./FileDrop";
import "./App.css";

const Map = ReactMapboxGl({});

class App extends Component {
  state = {
    images: [],
    mapStyle: {},
  };

  getMapStyle = (imageName, zoom) => ({
    version: 8,
    sources: {
      image_tiles: {
        type: "raster",
        tiles: [`http://localhost:3000/assets/${imageName}/{z}/{x}_{y}.jpg`],
        tileSize: 256,
        maxzoom: zoom,
      },
    },
    layers: [
      {
        id: "simple-tiles",
        type: "raster",
        source: "image_tiles",
      },
    ],
  });

  switchImage = (imageName, zoom) => {
    this.setState({
      mapStyle: this.getMapStyle(imageName, zoom),
    });
  };

  componentDidMount() {
    this.getImages("/listImages")
      .then(({ images }) => {
        this.setState({
          images,
          mapStyle: this.getMapStyle(images[0].name, images[0].zoom),
        });
      })
      .catch((err) => console.log(err));
  }

  getImages = async (url) => {
    const response = await fetch("/listImages");
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  };

  async sendFile(file) {
    const formData = new FormData();
    formData.append("image", file, file.name);
    const response = await fetch("http://localhost:5000/upload", {
      method: "POST",
      body: formData,
    });
    return response;
  }

  async uploadFile(files) {
    const promises = [];
    files.forEach((file) => {
      promises.push(this.sendFile(file));
    });
    try {
      const uploads = await Promise.all(promises);
    } catch (e) {
      console.log(e.message);
    }
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">Tiled Image Viewer</header>
        <div className="Tile-Viewer">
          <div className="Map-container">
            {this.state.mapStyle.version && (
              <Map
                style={this.state.mapStyle}
                zoom={[0]}
                containerStyle={{
                  height: "55vh",
                  width: "55vh",
                }}
              >
                <Layer type="raster" id="layer_id" sourceId="image_tiles" />
                <ZoomControl />
              </Map>
            )}
          </div>

          <div className="image-slider">
            <Carousel
              slidesToShow={3}
              displayDots={false}
              cellAlign="center"
              cellSpacing={10}
              width="35%"
              height="150px"
              defaultControlsConfig={{
                nextButtonText: "Next",
                prevButtonText: "Prev",
                pagingDotsStyle: {
                  fill: "red",
                },
              }}
            >
              {this.state.images.map(({ name, zoom }) => {
                return (
                  <img
                    key={name}
                    src={`http://localhost:3000/assets/${name}.jpg`}
                    onClick={() => this.switchImage(name, zoom)}
                  />
                );
              })}
            </Carousel>
          </div>
          <FileDrop uploadFile={this.uploadFile.bind(this)} />
        </div>
      </div>
    );
  }
}

export default App;
