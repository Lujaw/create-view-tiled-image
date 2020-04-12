const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const _ = require('lodash');
const path = require("path");
const tiler = require("image-tiler");
const readdirp = require("readdirp");

const app = express();
const port = process.env.PORT || 5000;


// enable files upload
app.use(fileUpload({
  createParentPath: true
}));

//add other middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const assetPath = path.join('client', 'public', 'assets');


app.get("/listImages", async (req, res) => {
  try {
    const list = await readdirp.promise(assetPath, {
      directoryFilter: ['!.git', '!*modules'],
      type: 'directories',
      depth: 1
    });
    const imagesWithZoomValue = _.chain(list)
      .filter(({ path }) => path.includes("/"))
      .groupBy(({ path }) => path.split("/")[0])
      .map((value, key) => ({ name: key, zoom: value.length - 1 }))
      .value();

    res.json({ images: imagesWithZoomValue });
  } catch (error) {
    console.log('server#38->>>', { error });
    res.status(500).send(error);
  }
});

app.post('/upload', async (req, res) => {
  try {
    console.log('server#43->>>', { req });
    if (!req.files) {
      res.send({
        status: false,
        message: 'No file uploaded'
      });
    } else {
      let image = req.files.image;

      const filePath = assetPath;

      image.mv(filePath + image.name);

      try {
        console.log('server#43->>>', { tiler, image });
        tiler.tile({ fileBuffer: image.data, filePath: path.join(filePath, image.name.split(".")[0]) });
      }
      catch (err) {
        console.log('server#47->>>', { err });
      }

      //send response
      res.send({
        status: true,
        message: 'File is uploaded',
        data: {
          name: image.name,
          mimetype: image.mimetype,
          size: image.size
        }
      });
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

app.listen(port, () => console.log(`Listening on port ${port}`));