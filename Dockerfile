FROM node:10-alpine

RUN npm install -g create-react-app firebase-tools

# Prevent the reinstallation of node modules at every changes in the source code
COPY package.json yarn.lock ./
RUN yarn install

EXPOSE 3000
