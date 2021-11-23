const http = require("http");
const app = require("./app");
const conn = require("./db");
const port = process.env.port || 3000;

require("dotenv").config();
const server = http.createServer(app);

conn.open().then(() => {
  server.listen(port, () =>
    console.log(`Server started listening at http://localhost:${port}`)
  );
});
