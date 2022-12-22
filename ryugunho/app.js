const http = require("http");

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { DataSource } = require("typeorm");

const app = express();

const dataSource = new DataSource({
    type: process.env.DB_TYPE,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    logging: process.env.DB_LOGGING
});

dataSource.initialize().then(() => {
    console.log("Your database is on fire!!!");
}).catch((err) => {
    console.log(err.message);
    dataSource.destroy();
})

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));


app.get("/ping", function(req, res) {
    res.status(200).json({ message: "pong" });
})

// 유저 회원가입 엔드포인트

app.post("/user", async function(req, res) {
    const user = req.body;

    const userData = await dataSource.query(
        `
        INSERT INTO users
        (
            name,
            email,
            profile_image,
            password
        )
        VALUES (?, ?, ?, ?)
        `
    , [ user.name, user.email, user.profile_image, user.password ]);

    res.status(201).json({ message: "userCreated!" });
})

// 게시글 업로드 엔드포인트

app.post("/post", async function(req, res) {
    const post = req.body;

    const postData = await dataSource.query(
        `
        INSERT INTO posts
        (
            title, 
            content,
            user_id,
            imageUrl
        )
        VALUES (?, ?, ?, ?)
        `
    , [ post.title, post.content, post.user_id, post.imageUrl ]);

    res.status(201).json({ message: "postCreated!" });
})

// 게시글 전체 보기 엔드포인트
app.get("/post", async function(req, res) {
    const posts = await dataSource.query(
        `
        SELECT 
            users.id AS userId, 
            users.profile_image AS userProfileImage,
            posts.id AS postingId, posts.imageUrl AS postingImageUrl, 
            posts.content AS postingContent

        FROM posts
        INNER JOIN users 
        ON posts.user_id = users.id;
        `
    )
    
    console.log(posts);
    res.status(200).json({ data: posts });
})

app.get("/user/post/:id", async function(req, res) {
    const userId = req.params.id;
    const userPostingData = await dataSource.query(
        `
        SELECT 
            u.id AS userId, 
            u.profile_image AS userProfileImage, 
            JSON_ARRAYAGG(
                JSON_OBJECT("postingId", p.id, "postingImageUrl", p.imageUrl, "postingContent", p.content)
                ) AS postings
        FROM users u 
        INNER JOIN posts p
        ON u.id = p.user_id
        WHERE u.id = ?
        GROUP BY u.id
        `
        , [ userId ]
    )

    res.status(200).json({ data: userPostingData });
})

// Update 엔드포인트 구현했습니다.

app.patch("/user/post/:id", async function(req, res) {
    const postId = req.params.id; 
    const { title, content, imageUrl }= req.body;

    const up = await dataSource.query(`
        UPDATE posts
            SET
                title = ?,
                content = ?,
                imageUrl = ?
            WHERE id = ?
    `
    , [ title, content, imageUrl, postId ]);
    console.log(up);

    const updatedPost = await dataSource.query(`
        SELECT
            u.id AS userId, 
            u.name AS userName, 
            p.id AS postingId, 
            p.title AS postingTitle, 
            p.content AS postingContent
        FROM users u
        INNER JOIN posts p
        ON u.id = p.user_id = 1
        WHERE p.id = ?
    `
    , [ postId ]
    );

    res.status(200).json({ data: updatedPost });
});


// 게시물 삭제 엔드포인트 구현
app.delete("/post/:id", async function(req, res) {
    const postId = req.params.id;

    await dataSource.query(`
        DELETE FROM likes
        WHERE post_id = ?
    `
    , [ postId ]
    )

    await dataSource.query(`
        DELETE FROM posts
        WHERE posts.id = ?
    `,
    [ postId ] 
    )

    res.status(201).json({ message: "A post has been deleted"});
});

// 좋아요 엔드포인트 구현

app.post("/likes/:id", async function (req, res) {
    const userId = req.params.id;
    const postId = req.body.postId; 

    await dataSource.query(`
        INSERT INTO likes
            (user_id, post_id)
        VALUES (?, ?)
    `,
    [ userId, postId ]
    );

    res.status(201).json({ message: "likeCreated" });
})



port = process.env.PORT;


app.listen(port);




