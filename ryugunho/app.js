require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const userRoutes = require("./routes/userRoutes");


const app = express();


app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.get("/ping", function(req, res) {
    res.status(200).json({ message: "pong" });
})

// 유저 회원가입 엔드포인트

app.use(userRoutes);





app.get("/user/post/:id", async function(req, res) {

    

    
})

// Update 엔드포인트 구현했습니다.

app.patch("/user/post/:id", async function(req, res) {
    const { postId } = req.params; 
    const { title, content, imageUrl }= req.body;

    await appDataSource.query(`
        UPDATE posts
            SET
                title = ?,
                content = ?,
                imageUrl = ?
            WHERE id = ?
    `
    , [ title, content, imageUrl, postId ]);

    const updatedPost = await appDataSource.query(`
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
    , [ postId ]);

    res.status(200).json({ data: updatedPost });
});

// 게시물 작성 엔드포인트 구현

app.post("/post", async function(req, res) {
    const { title, content, imageUrl } = req.body;

    const userId = req.userId;

    await appDataSource.query(`
        INSERT INTO posts
        (
            title,
            content,
            user_id,
            imageUrl
        )
        VALUES (?, ?, ?, ?)
    `, [title, content, userId, imageUrl ] 
    );

    return res.status(201).json({ message: "postCreated!" });
})

// 게시물 삭제 엔드포인트 구현

app.delete("/post/:id", async function(req, res) {
    const { postId } = req.params;

    await appDataSource.query(`
        DELETE FROM likes
        WHERE post_id = ?
    `
    , [ postId ]
    )

    await appDataSource.query(`
        DELETE FROM posts
        WHERE posts.id = ?
    `,
    [ postId ]);

    res.status(201).json({ message: "A post has been deleted"});
});

// 좋아요 엔드포인트 구현

app.post("/likes/:id", async function (req, res) {
    const { postId } = req.body; 

    const { userId } = req.params;

    await appDataSource.query(`
        INSERT INTO likes
            (user_id, post_id)
        VALUES (?, ?)
    `,
    [ userId, postId ]);

    res.status(201).json({ message: "likeCreated" });
})

// Error handling middleware

// app.use(function(error, req, res, next) {
//     res.status(404).json({ message: error.message });
// })

port = process.env.PORT;


app.listen(port, () => {
    console.log(`Your server is listening on ${port}`);
});








