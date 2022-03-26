FROM node:16

WORKDIR /app

COPY package*.json  yarn.lock /app

RUN yarn install

COPY . /app

RUN yarn run build

EXPOSE 8088

CMD npm run start:prod