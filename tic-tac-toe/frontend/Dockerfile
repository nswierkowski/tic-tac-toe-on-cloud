FROM node:14-alpine

WORKDIR /app

COPY package.json .

ENV REACT_APP_API_URL=http://localhost:8080
ENV REACT_USER_POOL_ID=60jbqq9qbfj2tda63ipna2q56m
ENV REACT_CLIEND_ID=us-east-1_U74pnUIz9

RUN npm install
RUN npm install axios
RUN npm install @stomp/stompjs --save
RUN npm install sockjs-client --save
RUN npm install amazon-cognito-identity-js

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
