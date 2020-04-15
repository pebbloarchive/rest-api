###
### Compile code
###
FROM node:alpine as tsc-builder

RUN apk --no-cache add --virtual native-deps \
  g++ gcc libgcc libstdc++ linux-headers autoconf automake make nasm python git && \
  npm install --quiet node-gyp -g

WORKDIR /usr/src/pebblo-api

COPY . .
RUN npm install
RUN npm run build

###
### Production stuff
###
FROM node:alpine as runtime-container

RUN apk --no-cache add --virtual native-deps \
  g++ gcc libgcc libstdc++ linux-headers autoconf automake make nasm python git && \
  npm install --quiet node-gyp -g

WORKDIR /usr/src/pebblo-api

COPY --from=tsc-builder /usr/src/pebblo-api/build ./build
COPY --from=tsc-builder /usr/src/pebblo-api/package.json ./

RUN npm install --production

# Launch app
CMD [ "node", "./build/app.js" ]