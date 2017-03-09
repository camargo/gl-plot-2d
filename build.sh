#!/bin/bash

rm index.js
npm run build:dev

cd example

rm -rf node_modules/gl-plot-2d
npm i
npm run build:dev
rm dist
