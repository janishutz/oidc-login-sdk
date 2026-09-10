#!/bin/bash

tsc --declaration
cp ./package.json ./dist
cp ./README.md ./dist

echo "Done"
