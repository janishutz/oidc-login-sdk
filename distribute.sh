#!/bin/bash

cd browser
./build.sh
cd dist
npm publish

cd ../../server
./build.sh
cd dist
npm publish
