FROM node:18-alpine

WORKDIR /app

RUN npm init -y && npm install express http-proxy-middleware

COPY html ./public
COPY css ./public/css
COPY images ./public/images
COPY js/index.js ./public/js/index.js
COPY js/server.js .

EXPOSE 3000

CMD ["node", "server.js"]