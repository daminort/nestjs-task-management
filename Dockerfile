# select image
FROM node:12.18.3
RUN npm install -g nodemon

WORKDIR /usr/src/app

# install deps and run application
ENV NPM_CONFIG_LOGLEVEL verbose
CMD ["sh", "-c", "npm install && npm run start:dev"]
