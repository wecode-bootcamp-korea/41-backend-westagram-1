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

//
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
// FROM u , INNER JOIN P = 유저와 포스트에서 값을 가져오겠다.
// 그 기준은 ON u.id = p.user_id 유저의 아이디와 포스트의 유저아이디 값에서.

app.patch('/modifypost/:id', async (req, res) => {
    const { id } = req.params;

    const { postingTitle, postingContent } = req.body;

    await mysqlDataSource.query(
        `
        UPDATE posts
           SET
              posting_title = ?,
              posting_content = ?
              WHERE id = ?
        `, [ postingTitle, postingContent, id ]);

        const updatedPost = await mysqlDataSource.query(
                ` 
                SELECT
                    u.user_id AS userId,
                    u.user_name AS userName,
                    p.posting_id AS postingId,
                    p.posting_title AS postingTitle,
                    p.posting_content AS postingContent
                    FROM users u
                    INNER JOIN posts p
                    ON u.id = p.user_id
                    WHERE u.id = ?
                `, [ id ]
        );
        res.status(200).json({ data : updatedPost })
});


app.delete('/postDel/:id', async (req, res) => {
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
app.post("/likes/", async function (req, res) {
    const { userId, postId } = req.body; 

    await mysqlDataSource.query(
        `
        INSERT INTO likes (
                likes.user_id, 
                likes.post_id
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