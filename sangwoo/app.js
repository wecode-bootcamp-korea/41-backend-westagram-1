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


app.get("/ping", cors(), function (req, res, next) {
    res.json({ message: "pong"});
});


// CURS - C
app.post("/users", async (req, res, next) => {
    const { userId, userProfileImage } = req.body
     
    await mysqlDataSource.query(
        `INSERT INTO users(
                 userId,
                 userProfileImage
                 ) VALUES (?, ?);
                 `, [ userId, userProfileImage ]
        );
         res.status(201).json({ message : "userCreated" });
    });
    
const PORT = process.env.PORT;
     
const start = async () => {
    app.listen(PORT, () => console.log(`server is listening on ${PORT}`))
};

start();