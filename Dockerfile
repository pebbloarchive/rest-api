FROM node

WORKDIR /usr/app

COPY package*.json./  /usr/app

RUN npm install

COPY . .

COPY .env ./build/

WORKDIR /build

EXPOSE 3000

CMD node app.js

# CMD ["npm", "start"]