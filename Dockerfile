FROM docker.io/node:22-alpine AS build
WORKDIR /source

COPY package-lock.json .
COPY package.json .

RUN npm i --no-audit

COPY . .

RUN npm run build

FROM docker.io/nginx:1.29.2-alpine

RUN apk add bash

RUN mkdir /etc/nginx/templates
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY docker/create-env-js.sh /docker-entrypoint.d
RUN chmod +x /docker-entrypoint.d/create-env-js.sh

COPY --from=build /source/build /usr/share/nginx/html