FROM alpine
RUN echo "http://ftp.halifax.rwth-aachen.de/alpine/v3.16/main">>/etc/apk/repositories
RUN echo "http://ftp.halifax.rwth-aachen.de/alpine/v3.16/community">>/etc/apk/repositories
RUN apk update && apk add nodejs docker docker-cli-compose npm
COPY packages/web/package.json /app/package.json
WORKDIR /app
RUN npm i
COPY packages/web/dist /app/dist
EXPOSE 3000
CMD npm run start