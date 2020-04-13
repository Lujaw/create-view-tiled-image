<!--
title: 'Create View Image Tiler'
description: 'A simple program to upload the image, create its image pyramid and then display the image in mapbox'
framework: v1
language: nodeJS
authorLink: 'https://github.com/lujaw'
authorName: 'Luja Shrestha'
-->

# Create View Image Tiler

A simple program to upload the image, create its image pyramid and then display the image in mapbox

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

### TODO

- Make the UI prettier
- Add test cases
- Add other extension support
