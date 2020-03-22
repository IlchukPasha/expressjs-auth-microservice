 
FROM node:10.19.0-slim

ENV NODE_ENV=production

WORKDIR /app

COPY package.json package-lock*.json ./

RUN yarn && yarn cache clean

COPY . .

CMD ["node", "./server.js"]