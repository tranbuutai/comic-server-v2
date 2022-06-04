FROM node:16

WORKDIR /workspace

COPY package.json yarn.lock /workspace/

RUN yarn

COPY . .

EXPOSE 8088

CMD ["yarn", "run", "start:dev"]
