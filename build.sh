#!/bin/sh
npm install \
&& npm run build \
&& cd scripts/docker \
&& docker-compose up --build