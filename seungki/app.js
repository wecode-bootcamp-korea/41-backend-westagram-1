const http = require("http");
// Cross-Origin Resource Sharing 교차 출처 리소스 공유 정책

require('dotenv').config();
const express = require("express");
const cors = require("cors"); 
const morgan = require("morgan");
const { DataSource } = require("typeorm");

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

const mysqlDatabase = new DataSource({
  type: process.env.TYPEORM_CONNECTION,
  host: process.env.TYPEORM_HOST,
  port: process.env.TYPEORM_PORT,
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE
});

mysqlDatabase.initialize()
.then(() => {
  console.log("Data Source has been inilialized!💡")
})
.catch((err) => {
  console.error("Error during Data Source initialization", err)
  mysqlDatabase.destroy()
})


app.get("/ping", (req, res) => {
res.status(200).json({"message" : "pongsssss"});
});


const PORT = process.env.PORT;

const start = async () => {
  try {
    app.listen(PORT, () => console.log(`server is listening on ${PORT}🔥🔥🔥🔥🔥🔥🔥`))
  } catch (err) {
    console.error(err)
  }
};

start();