require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const appDataSource = require("./database/database");
const routes = require('./routes')


const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use(routes);


app.get("/ping", function(req, res) {
    res.status(200).json({ message: "pong" });
})

// 유저 회원가입 엔드포인트


app.use((error, req, res, next) => {
    console.error(error);
})

port = process.env.PORT;


const start = async () => {
    await appDataSource.initialize();
    app.listen(port);
    console.log(`Your server is listening on ${port}`);
};


start();








