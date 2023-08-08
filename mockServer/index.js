/**
 * 模拟 Api 服务
 */
const http = require("http");

const hostname = "127.0.0.1";
const port = 22222;

http
  .createServer((req, res) => {
    const method = req.method?.toLocaleLowerCase();
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "*");
    res.setHeader("Content-Type", "text/plain");
    res.statusCode = 200;

    if (["get", "post"].includes(method)) {
      res.end("Success: " + ` （${method}）`);
    } else {
      res.end("Only allow GET and POST: " + ` （${method}）`);
    }
  })
  .listen(port, hostname, () => {
    console.log(`Api Server running at http://${hostname}:${port}/`);
  });
