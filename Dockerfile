FROM node:8-alpine

EXPOSE 3000

ARG NODE_ENV
ENV NODE_ENV $NODE_ENV

RUN mkdir /app
WORKDIR /app
ADD package.json yarn.lock /app/
RUN yarn
ADD . /app
COPY .docker.env /app/.env

CMD ["yarn", "docker:start"]