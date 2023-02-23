FROM alpine
RUN echo "http://ftp.halifax.rwth-aachen.de/alpine/v3.16/main">>/etc/apk/repositories
RUN echo "http://ftp.halifax.rwth-aachen.de/alpine/v3.16/community">>/etc/apk/repositories
RUN apk update && apk add nodejs docker docker-cli-compose npm
WORKDIR /app
COPY dist /app
EXPOSE 3000
CMD node server.mjs