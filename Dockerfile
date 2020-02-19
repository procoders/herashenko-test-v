FROM node:lts-alpine
WORKDIR /testtask/server
COPY ./.env.production ./.env.production
COPY package.json ./
COPY ormconfig.json ./
RUN apk --no-cache add --virtual builds-deps build-base python
COPY dist ./dist
RUN npm install --only=prod
EXPOSE 2502
CMD ["node", "dist/main.js"]