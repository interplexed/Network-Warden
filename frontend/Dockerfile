FROM node:16

WORKDIR /frontend

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm", "start"]
