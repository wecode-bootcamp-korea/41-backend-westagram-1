const http = require ('http');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const dotenv = require('dotenv');
dotenv.config()

const { DataSource } = require('typeorm')

const myDataSource = new DataSource({
    type: process.env.TYPEORM_CONNECTION,
    host: process.env.TYPEORM_HOST,
    port: process.env.TYPEORM_PORT,
    username: process.env.TYPEORM_USERNAME,
    password: process.env.TYPEORM_PASSWORD,
    database: process.env.TYPEORM_DATABASE
})

myDataSource.initialize()
.then(() => {
    console.log("Data Source has been initialized!")
 })

 const app = express();
 
 app.use(cors());
 app.use(morgan('dev'));
 app.use(express.json());


// CURS - C
app.post("/authors", async (req, res, next) => {
    const { first_name, last_name, age} = req.body

    await myDataSource.query(
        `INSERT INTO authors(
            first_name,
            last_name,
            age
        ) VALUES (?, ?, ?);
        `, [ first_name, last_name, age]
    );
    res.status(201).json({ message : "userCreated" });
});

app.get("/ping", cors(), function (req, res, next) {
    res.json({ message: "pong"});
});

const server = http.createServer(app)
const PORT = process.env.PORT;

const start = async () => {
    server.listen(PORT, () => console.log(`server is listening on ${PORT}`))
};

start();