#!/bin/sh

# Exit on errors
set -e

CONTAINER=volunteers-elsewhere

echo "Building $CONTAINER ..."
docker build -t $CONTAINER .
echo "Build complete"
