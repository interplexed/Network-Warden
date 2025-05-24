FROM node:18

# Privileges for logs on the Docker host if required
#RUN groupadd -g 2000 dockerloggroup && useradd -m -u 2000 -g dockerloggroup dockerloguser
#USER dockerloguser

WORKDIR /suricata

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 4000

CMD ["npm", "start"]
