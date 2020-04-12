const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const _ = require('lodash');
const path = require("path");
const tiler = require("image-tiler");

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

app.post('/upload', async (req, res) => {
  try {
    if (!req.files) {
      res.send({
        status: false,
        message: 'No file uploaded'
      });
    } else {
      let image = req.files.image;

      const filePath = path.join('client', 'public', 'assets');

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