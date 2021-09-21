FROM node:alpine
WORKDIR /app
COPY ./killbee_frontend/package.json ./
COPY ./killbee_frontend/package-lock.json ./
COPY ./killbee_frontend ./
RUN npm i
CMD ["npm", "run", "start"]