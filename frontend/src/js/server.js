const express = require('express');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');
//for web server on port 3000 and proxy to backend on port 5000
const app = express();
const PORT = process.env.PORT || 3000;

app.use('/api', createProxyMiddleware({
  target: process.env.BACKEND_URL || 'http://backend:5000',
  changeOrigin: true,
  pathRewrite: (requestPath) => `/api${requestPath}`
}));
app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
  console.log(`Frontend Weather Pulse on ${PORT} port`);
});
