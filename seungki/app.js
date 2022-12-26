require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { DataSource } = require('typeorm');

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

const mysqlDatabase = new DataSource({
  type: process.env.TYPEORM_CONNECTION,
  host: process.env.TYPEORM_HOST,
  port: process.env.TYPEORM_PORT,
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,
});

mysqlDatabase
  .initialize()
  .then(() => {
    console.log('Data Source has been inilialized!💡');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err);
    mysqlDatabase.destroy();
  });

// Health Check
app.get('/ping', (req, res) => {
  res.status(200).json({ message: 'pongsssss' });
});

// 유저 회원가입 & Bcrypt를 이용하여 비밀번호 암호화하기
app.post('/email_signup', async (req, res) => {
  const { name, email, profileImage, password } = req.body;

  const saltRounds = 12;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // const checkHash = await bcrypt.compare(password, hashedPassword);

  await mysqlDatabase.query(
    `INSERT INTO users(
        name,
        email,
        profile_image,
        password
    ) VALUES (?, ?, ?, ?);
    `,
    [name, email, profileImage, hashedPassword]
  );
  res.status(201).json({ message: 'userCreated' });
});

// 게시물 등록하기
app.post('/post_created', async (req, res) => {
  const { title, content, postImage, userId } = req.body;

  await mysqlDatabase.query(
    `INSERT INTO posts(
        title,
        content,
        post_image,
        user_id
    ) VALUES (?, ?, ?, ?);
    `,
    [title, content, postImage, userId]
  );
  res.status(201).json({ message: 'postCreated' });
});

// 전체 게시글 조회하기
app.get('/posts', async (req, res) => {
  await mysqlDatabase.query(
    `SELECT
        u.id AS userId,
        u.profile_image AS userProfileImage,
        p.id AS postingId,
        p.post_image AS postingImageUrl,
        p.content AS postingContent
    FROM users u
    INNER JOIN posts p ON u.id = p.user_id`,
    (err, rows) => {
      res.status(200).json({ data: rows });
    }
  );
});

// 유저의 게시물 조회하기
app.get('/user_post/userId/:userId', async (req, res) => {
  const { userId } = req.params;

  const [userPostList] = await mysqlDatabase.query(
    `SELECT
        u.id AS userId,
        u.profile_image AS userProfileImage,
        JSON_ARRAYAGG(
          JSON_OBJECT(
            "postingId", p.id,
            "postingImageUrl", p.post_image,
            "postingContent", p.content
          )
        ) AS postings
    FROM users u
    INNER JOIN posts p ON u.id = p.user_id
    WHERE u.id = ?
    GROUP BY u.id;
    `,
    [userId]
  );
  res.status(200).json({ data: userPostList });
});

// 게시글 수정하기
app.patch('/post_modify/postId/:postId', async (req, res) => {
  const { title, content, postImage } = req.body;
  const { postId } = req.params;

  await mysqlDatabase.query(
    `UPDATE posts
      SET title = ?,
          content = ?,
          post_image = ?
      WHERE id = ?
      `,
    [title, content, postImage, postId]
  );

  const [postModify] = await mysqlDatabase.query(
    `SELECT
        u.id AS user_id,
        u.name AS userName,
        p.id AS postingId,
        p.title AS postingTitle,
        p.content AS postingContent
    FROM users u
    INNER JOIN posts p ON u.id = p.user_id
    WHERE p.id = ?
    `,
    [postId]
  );
  res.status(200).json({ data: postModify });
});

// 게시글 삭제하기
app.delete('/post_delete/postId/:postId', async (req, res) => {
  const { postId } = req.params;

  await mysqlDatabase.query(
    `DELETE FROM posts
    WHERE id = ?
    `,
    [postId]
  );
  res.status(200).json({ message: 'postingDeleted' });
});

// 좋아요 누르기
app.post('/likes', async (req, res) => {
  const { userId, postId } = req.body;

  const [likes] = await mysqlDatabase.query(
    `SELECT
      id
    FROM likes
    WHERE user_id = ?
    AND post_id = ?
      `,
    [userId, postId]
  );

  if (!likes) {
    await mysqlDatabase.query(
      `INSERT INTO likes(
          user_id,
          post_id
      ) VALUES (?, ?);
      `,
      [userId, postId]
    );
  } else {
    await mysqlDatabase.query(
      `DELETE FROM likes
        WHERE likes.id = ?
        `,
      [likes.id]
    );
  }
  res.status(200).json({ message: 'likeCreated' });
});

const PORT = process.env.PORT;
const start = async () => {
  try {
    app.listen(PORT, () => console.log(`server is listening on ${PORT}🔥🔥🔥🔥🔥🔥🔥`));
  } catch (err) {
    console.error(err);
  }
};

start();
