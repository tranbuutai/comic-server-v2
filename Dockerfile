FROM node:16

WORKDIR /app

COPY package*.json yarn.lock ./

RUN yarn

COPY . .

RUN yarn run build

EXPOSE 8080

CMD [ "node", "dist/main" ]