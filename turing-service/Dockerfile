# Turing Service Dockerfile
FROM node:14

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

COPY TuringMachine.jar ./

EXPOSE 5001

CMD ["node", "index.js"]