# quidoServer
Node.JS app for Papouch Quido modules

## quickstart guide
```
docker pull jirrick/quidoserver:latest
docker run -v /path/to/config.js:/usr/src/app/src/config.js -d -p 3001:3001 jirrick/quidoserver:latest
```