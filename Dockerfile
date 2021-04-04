FROM node:14

# Create app directory
WORKDIR /app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install

# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

RUN rm -rf ./content/adapters/storage/ghost-storage-cloudinary
RUN mv node_modules/ghost-storage-cloudinary ./content/adapters/storage/ghost-storage-cloudinary

RUN cp -Rf node_modules/casper content/themes

RUN rm config.production.json

EXPOSE 8080
#CMD node ./bin/create-config
CMD [ "node", "server.js" ]