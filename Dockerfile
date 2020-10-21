FROM node:12

#create the app directory
WORKDIR /usr/scr/app

#install dependencies
COPY package*.json ./

RUN npm install

COPY . .
EXPOSE 8000

CMD ["node", "server.js"]