FROM node:current

LABEL maintainer="Tavern Kinder <tavernkinder711@gmail.com>"
LABEL description="A simple Chat application using Socket.IO." version="0.1"
LABEL cohort="cohort-22"
LABEL animal="raccoon"

WORKDIR /usy/src/webApp

COPY package*.json ./
RUN npm install
RUN npm audit fix

COPY . .

EXPOSE 3000

CMD ["npm", "start"]