#!/bin/bash

DT=$(date +'%Y-%m-%d %H:%M:%S')
find . -name ".DS_Store" -delete
git add .
git commit -m "Auto Push at: $DT"
git push origin main