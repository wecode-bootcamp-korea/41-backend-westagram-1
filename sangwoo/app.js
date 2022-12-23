require('dotenv').config()

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const { DataSource } = require('typeorm')

const mysqlDataSource = new DataSource({
    type: process.env.TYPEORM_CONNECTION,
    host: process.env.TYPEORM_HOST,
    port: process.env.TYPEORM_PORT,
    username: process.env.TYPEORM_USERNAME,
    password: process.env.TYPEORM_PASSWORD,
    database: process.env.TYPEORM_DATABASE
})

mysqlDataSource.initialize()
.then(() => {
    console.log("Data Source has been initialized!")
 })

 const app = express();
 
 app.use(cors());
 app.use(morgan('dev'));
 app.use(express.json());

// health check
//app.get("/ping", cors(), function (req, res, next) {
//    res.json({ message: "pong"});
//});


// CURS - C
app.post("/authors", async (req, res, next) => {
    const { first_name, last_name, age} = req.body
     
    await mysqlDataSource.query(
        `INSERT INTO authors(
                 first_name,
                 last_name,
                 age
                 ) VALUES (?, ?, ?);
                 `, [ first_name, last_name, age]
        );
         res.status(201).json({ message : "userCreated" });
    });
    
const PORT = process.env.PORT;
     
const start = async () => {
    app.listen(PORT, () => console.log(`server is listening on ${PORT}`))
};

start();