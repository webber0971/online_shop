# Base image
FROM node:latest
# Create app directory
RUN mkdir -p /usr/src/webserver
WORKDIR /usr/src/webserver
# Install app dependencies
COPY package.json /usr/src/webserver/
RUN npm install 
# Bundle app source
COPY . /usr/src/webserver
CMD npm start