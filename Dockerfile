FROM keymetrics/pm2:6

# Create app directory
WORKDIR /usr/src/quido

# Bundle APP files
COPY src src/
COPY package.json .
COPY pm2.json .

# Install app dependencies
ENV NPM_CONFIG_LOGLEVEL warn
RUN npm install --production

# Show current folder structure in logs
#RUN ls -al -R

CMD [ "pm2-docker", "start", "pm2.json", "--env" ,"production" ]
