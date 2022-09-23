FROM node:18.9.0

#RUN mkdir -p /app
WORKDIR /app

COPY . .
#COPY package*.json ./counter
RUN npm ci


EXPOSE 1234


CMD ["npm", "start"]