const http = require("http");
const crypto = require("crypto");
const Express = require("./lib/Express.js");
const { GET, POST, DELETE, PUT } = require("./controllers/news-controller.js");

let PORT = process.env.PORT || 4000;

function httpServer(req, res) {
  const app = new Express(req, res);

  app.get("/news", GET);
  app.delete("/news", DELETE);
  app.put("/news", PUT);
  app.post("/add", POST);
}

const server = http.createServer(httpServer);
server.listen(PORT, () => console.log("Server *4000 : https://localhost:4000"));
