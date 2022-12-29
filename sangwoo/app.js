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
app.post("/signup", async (req, res, next) => {
    const { name, email, profile, password } = req.body
     
    await mysqlDataSource.query(
        `INSERT INTO users(
                 name,
                 email,
                 profile_image,
                 password
                 ) VALUES (?, ?, ?, ?);
                 `, [ name, email, profile, password ]
        );
         res.status(201).json({ message : "userCreated" });
    });

app.post("/posts", async (req, res, next) => {
    const { postingTitle, postingContent, postingUserId } = req.body

    await mysqlDataSource.query(
        `INSERT INTO posts(
                title,
                content,
                user_id
            )  VALUES (?, ?, ?);
            `, [ postingTitle, postingContent, postingUserId ]
    );
    res.status(201).json({ message : "postCreated" })
});

// CURD-R
app.get('/allDB', async (req, res) => {
    await mysqlDataSource.query(
        ` SELECT
               u.id,
               u.profile_image,
               p.id,
               p.title,
               p.content
            FROM users, posts
            `, (err, rows) => { res.status(200).json(rows);
        })
});

// CURD-R
app.get('/posts/users/:id', async (req, res) => {
    const { id } = req.params;
    const userPostingData = await mysqlDataSource.query(
        ` SELECT 
            u.id AS userId,
            u.profile_image userProfileImage,
                JSON_ARRAYAGG(
                    JSON_OBJECT("postingId", p.id, "postingImageUrl", p.title, 
                    "postingContent", p.content)
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


app.patch('/post/:id', async (req, res) => {
    const { id } = req.params;

    const { postingTitle, postingContent } = req.body;

   const updatedPost = await mysqlDataSource.query(
        `
        UPDATE posts
           SET
              title = ?,
              content = ?,
              WHERE id = ?;
            SELECT
            u.id AS userId,
            u.name AS userName,
            p.id AS postingId,
            p.title AS postingTitle,
            p.content AS postingContent
            FROM users u
            INNER JOIN posts p
            ON u.id = p.user_id
            WHERE u.id = ?;
        `, [ postingTitle, postingContent, id, id ]
        );
        res.status(200).json({ data : updatedPost })
});


app.delete('/post/:id', async (req, res) => {
    const { id } = req.params;

    await mysqlDataSource.query(
        `
        DELETE FROM posts
        WHERE posts.id = ? 
        `, [ id ]
    );
    res.status(204).json({ message : "postingDeleted" })
})

// Assignment 8 좋아요 엔드포인트
app.post("/likes/:id", async (req, res) => {
    const { postId, userId } = req.body;

    await mysqlDataSource.query(
        `
        INSERT INTO likes (
            user_id,
            post_id
        ) VALUES (?, ?)
    `, [ userId, postId ]
    );
    res.status(201).json({ message: "likeCreated" });
})


const PORT = process.env.PORT;
     
const start = async () => {
    app.listen(PORT, () => console.log(`server is listening on ${PORT}`))
};

start();