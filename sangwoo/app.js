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
    const { first_name, last_name, age} = req.body
     
    await mysqlDataSource.query(
        `INSERT INTO users(
                 first_name,
                 last_name,
                 age
                 ) VALUES (?, ?, ?);
                 `, [ first_name, last_name, age]
        );
         res.status(201).json({ message : "userCreated" });
    });

app.post("/posts", async (req, res, next) => {
    const { title, content, user_id } = req.body

    await mysqlDataSource.query(
        `INSERT INTO posts(
                title,
                content,
                user_id
            )  VALUES (?, ?, ?);
            `, [ title, content, user_id ]
    );
    res.status(201).json({ message : "postCreated" })
});

app.post("/alldata", async (req, res, next) => {
    const { userId, userProfileImage, postingId, 
            postingImageUrl, postingContent } = req.body

    await mysqlDataSource.query(
        `INSERT INTO alldata(
                userId,
                userProfileImage,
                postingId,
                postingImageUrl,
                postingContent
        )   VALUES (?, ?, ?, ?, ?);
        `, [ userId, userProfileImage, postingId,
             postingImageUrl, postingContent ]
    );
    res.status(201).json({ message : "alldataCreated" })
});

// CURD-U
app.get('/alldata', async (req, res) => {
    await mysqlDataSource.query(
        `SELECT
               alldata.userId,
               alldata.userProfileImage,
               alldata.postingId,
               alldata.postingImageUrl,
               alldata.postingContent
            FROM alldata alldata`
        ,(err, rows) => {
                res.status(200).json(rows);
        })
});


const PORT = process.env.PORT;
     
const start = async () => {
    app.listen(PORT, () => console.log(`server is listening on ${PORT}`))
};

start();