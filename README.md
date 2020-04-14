<!--
title: 'Create View Tiled Image'
description: 'A simple program to upload the image, create its image pyramid and then display the image in mapbox'
framework: v1
language: nodeJS
authorLink: 'https://github.com/lujaw'
authorName: 'Luja Shrestha'
-->

# Create View Tiled Image

A simple program to upload the image, create its image pyramid and then display the image in mapbox

## Feature

It uses the node module "image-tiler" create for the backend test to create the image pyramid

## Pre-requisites

In order to run the utility function, you will need the following:

- Node.js 12.0

## Setting up the project

1. Clone the repository and install the dependencies for both server and client using :

```
npm run install-all
```

2. Start both the frontend and backend server using the command

```
npm start
```

3: The frontend should be available in port 3000, and should be serving one image. Other can be uploaded
using the upload button. It only supports .jpg extension now.

4: The image in the carousel needs to be clicked for the Mapbox to be updated

### TODO

- Make the UI prettier
- Add test cases
- Add other extension support
- Add event in the carousel control to update mapbox
