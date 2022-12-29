require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { validateToken } = require("./token");
const { DataSource } = require("typeorm");

const app = express();

const appDataSource = new DataSource({
    type: process.env.DB_TYPE,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    logging: process.env.DB_LOGGING
});

appDataSource.initialize().then(() => {
    console.log("Your database is on fire!!!");
}).catch((err) => {
    console.log(err.message);
    appDataSource.destroy();
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

    const saltRound = 12;
    const hashedPassword = await bcrypt.hash(user.password, saltRound);

    await appDataSource.query(
        `
        INSERT INTO users (
            name,
            email,
            profile_image,
            password
        ) VALUES (?, ?, ?, ?)
        `, [ user.name, user.email, user.profile_image, hashedPassword ]);
    
    res.status(200).json({ messsage: "userCreated!" });
});


// 로그인 엔트포인트

app.post("/login", async function(req, res) {
    const userData = req.body;

    const [ existingUser ] = await appDataSource.query(`
        SELECT * 
        FROM users
        WHERE email = ?
    
    `, [ userData.email ]);

    if (!existingUser) {
        return res.status(401).json({ message: "Invalid user!!! Maybe create one?"});
    }

    const passwordsAreEqual = await bcrypt.compare(userData.password, existingUser.password);

    if (!passwordsAreEqual) {
        return res.status(401).json({ message: "Invalid password!!!"});
    }

    const jwtToken = jwt.sign({ userId: existingUser.id }, process.env.secretKey);

    return res.status(200).json({ accessToken: jwtToken });
})

app.get("/user/post/:id", async function(req, res) {
    const { userId } = req.params;
    const userPostingData = await appDataSource.query(
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

app.post("/post", validateToken, async function(req, res) {
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

app.use(function(a, req, res, next) {
    res.status(404).json({ message: a.message });
})

port = process.env.PORT;

app.listen(port);









