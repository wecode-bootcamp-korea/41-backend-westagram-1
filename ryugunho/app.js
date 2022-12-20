const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const morgan = require("morgan");
const { DataSource } = require("typeorm");

const app = express();

dotenv.config();

const myDataSource = new DataSource({
    type: process.env.DB_TYPE,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    logging: process.env.DB_LOGGING
});

myDataSource.initialize().then(() => {
    console.log("Your database is on fire!!!");
}).catch((err) => {
    console.log(err.message);
    myDataSource.destroy();
})

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));


port = process.env.PORT;


app.listen(port);