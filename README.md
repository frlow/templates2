# Templates server (v2)

Templates server is an open source, self-hosted "store" to simplify installing Docker apps.

## Installation

### Install docker

Install docker on your server.

```
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
```

### Forward ports

Forward port 80 & 443 to the ip of your server.

### Get a domain name

Get a domain name and forward it to your public IP. The domain provider must support wildcard subdomains.
You can get a free domain at: [DuckDns](https://www.duckdns.org/)

### Start the app

Run the server using:

```
docker run --rm -it -v /var/run/docker.sock:/var/run/docker.sock --net=host lowet84/templates2 node init.mjs
```

Set up folder permissions:
```
docker run --rm -it -v templates_media:/data -w /data lowet84/templates2 sh -c "mkdir TV Movies complete incomplete && chown 1000:1000 -R ."
```

You will be prompted for the following information.

- Username, pick a username, it will be used for authentication and used as default username for apps that support
  configuring a username externally
- Password, password for authentication
- Domain, your domain name
- Https or http, https recommended, the server will automatically get a valid ssl certificate from LetsEncrypt
- Image, a custom docker image if you want to run you own fork of the server.
- Project, custom project name, used by docker-compose for naming containers and volumes
- Test, test that ports and domain have been configured correctly. 
