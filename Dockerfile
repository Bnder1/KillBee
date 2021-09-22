FROM node:alpine
WORKDIR /app
COPY ./killbee_frontend ./
RUN npm i
CMD ["npm", "run", "start"]