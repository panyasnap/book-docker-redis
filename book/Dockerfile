FROM node:18.9.0


WORKDIR /app

COPY . .
#COPY package*.json ./book
RUN npm ci


EXPOSE 3000


CMD ["npm", "start"]