FROM node:18-alpine

WORKDIR /app

RUN npm init -y && npm install express mongoose cors

COPY server.js .

EXPOSE 5000

CMD ["node", "server.js"]