#!/bin/bash

if [ ! -d "node_modules" ]; then
  npm cache clean
  npm install
fi

rm index.js
npm run build:dev

cd example

rm -rf node_modules/gl-plot-2d
npm i
npm run build:dev
rm dist
