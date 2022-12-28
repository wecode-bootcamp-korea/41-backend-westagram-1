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


app.get("/ping", function (req, res, next) {
    res.json({ message: "pong"});
});


// CURS - C
app.post("/users", async (req, res, next) => {
    const { userId, userProfileImage } = req.body
     
    await mysqlDataSource.query(
        `INSERT INTO users(
                 user_id,
                 user_profile
                 ) VALUES (?, ?);
                 `, [ userId, userProfileImage ]
        );
         res.status(201).json({ message : "userCreated" });
    });

app.post("/posts", async (req, res, next) => {
    const { postingId, postingImageUrl, postingContent } = req.body

    await mysqlDataSource.query(
        `INSERT INTO posts(
                posting_id,
                posting_image,
                posting_content
            )  VALUES (?, ?, ?);
            `, [ postingId, postingImageUrl, postingContent ]
    );
    res.status(201).json({ message : "postCreated" })
});

// CURD-U
app.get('/allDB', async (req, res) => {
    await mysqlDataSource.query(
        `SELECT
               users.user_id,
               users.user_profile,
               posts.posting_id,
               posts.posting_image,
               posts.posting_content
            FROM users, posts
            `, (err, rows) => { res.status(200).json(rows);
        })
});


app.get('/posts/users/:id', async (req, res) => {
    const { id } = req.params;
    const userPostingData = await mysqlDataSource.query(
        ` SELECT 
            u.user_id AS userId,
            u.user_profile AS userProfileImage,
                JSON_ARRAYAGG(
                    JSON_OBJECT("postingId", p.posting_id, "postingImageUrl", p.posting_image, 
                    "postingContent", p.posting_content)
                ) AS postings
                FROM users u
                INNER JOIN posts p
                ON u.id = p.user_id
                WHERE u.id = ?
                GROUP BY u.id 
        `, [ id ] 
        ); 
        res.status(200).json({ data: userPostingData });
    });


app.put('/modifyUser', async (req, res) => {
    const { userId, userName, postingId, postingTitle, postingContent } = req.body

    await mysqlDataSource.query(
        ` UPDATE users
            SET
                user_id = ?,
                user_name = ?,
                posting_id = ?,
                posting_title = ?,
                posting_content = ?
                WHERE id = ?
        `, [ userId, userName, postingId, postingTitle, postingContent]
    );
    res.status(201).json({ message :" successfully updated" })
})

    
const PORT = process.env.PORT;
     
const start = async () => {
    app.listen(PORT, () => console.log(`server is listening on ${PORT}`))
};

start();