// proxy.js
const http = require("http");
const httpProxy = require("http-proxy");

const TARGET_URL = process.env.TARGET_URL || "http://localhost:3000"; // The service you're forwarding to
const PORT = process.env.PORT || 8080; // Render assigns this dynamically

// Create a proxy server instance
const proxy = httpProxy.createProxyServer({
  target: TARGET_URL,
  changeOrigin: true,
  secure: false,
});

// Create HTTP server to listen for traffic to forward
http
  .createServer((req, res) => {
    console.log(`Proxying request: ${req.method} ${req.url}`);
    proxy.web(req, res, (err) => {
      console.error("Proxy error:", err);
      res.statusCode = 500;
      res.end("Proxy error occurred");
    });
  })
  .listen(PORT, () => {
    console.log(`Proxy server running on port ${PORT}`);
    console.log(`Forwarding traffic to: ${TARGET_URL}`);
  });
