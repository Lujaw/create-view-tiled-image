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
    res.status(500).send(error);
  }
});

app.post('/upload', async (req, res) => {
  try {
    if (!req.files) {
      res.send({
        status: false,
        message: 'No file uploaded'
      });
    } else {
      let image = req.files.image;

      const filePath = assetPath;
      try {
        image.mv(path.join(filePath, image.name));
        const options = {
          output: path.join(filePath, image.name.split(".")[0]),
          pyramid: true
        };
        tiler.tile({ fileBuffer: image.data, options });
      }
      catch (err) {
        console.log(err);
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