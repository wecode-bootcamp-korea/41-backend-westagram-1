require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validateToken } = require('./middleware/auth');

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
    console.log('Data Source has been inilialized!๐ก');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err);
    mysqlDatabase.destroy();
  });

// Health Check
app.get('/ping', (req, res) => {
  res.status(200).json({ message: 'pongsssss' });
});

// ์ ์  ํ์๊ฐ์ & Bcrypt๋ฅผ ์ด์ฉํ์ฌ ๋น๋ฐ๋ฒํธ ์ํธํํ๊ธฐ
app.post('/signup', async (req, res) => {
  const { name, email, profileImage, password } = req.body;

  const saltRounds = 12;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

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

// ์ ์  ๋ก๊ทธ์ธ & Bcrypt Verification ๋ฐ JWT ๋ฐ๊ธํ๊ธฐ
app.post('/signin', async (req, res) => {
  const { email, password } = req.body;

  const [users] = await mysqlDatabase.query(
    `SELECT
      *
    FROM users
    WHERE email = ?
    `,
    [email]
  );

  const checkHash = await bcrypt.compare(password, users.password);

  if (checkHash) {
    const jwtToken = jwt.sign(users.id, process.env.SECRETKEY);
    res.status(200).json({ accessToken: jwtToken });
  }
  if (!checkHash) {
    res.status(401).json({ message: 'Invalid User' });
  }
});

// ๊ฒ์๋ฌผ ๋ฑ๋กํ๊ธฐ & ๋ก๊ทธ์ธ ํ ์ฌ์ฉ์๋ง ๊ฒ์๊ธ ๋ฑ๋กํ๊ธฐ
app.post('/posts', validateToken, async (req, res) => {
  const { title, content, postImage } = req.body;

  await mysqlDatabase.query(
    `INSERT INTO posts(
        title,
        content,
        post_image,
        user_id
    ) VALUES (?, ?, ?, ?);
    `,
    [title, content, postImage, req.userId]
  );
  res.status(201).json({ message: 'postCreated' });
});

// ์ ์ฒด ๊ฒ์๊ธ ์กฐํํ๊ธฐ
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
      if (err) {
        console.error(err);
      } else {
        res.status(200).json({ data: rows });
      }
    }
  );
});

// ์ ์ ์ ๊ฒ์๋ฌผ ์กฐํํ๊ธฐ
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

// ๊ฒ์๊ธ ์์ ํ๊ธฐ
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

// ๊ฒ์๊ธ ์ญ์ ํ๊ธฐ
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

// ์ข์์ ๋๋ฅด๊ธฐ
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
    app.listen(PORT, () => console.log(`server is listening on ${PORT}๐ฅ๐ฅ๐ฅ๐ฅ๐ฅ๐ฅ๐ฅ`));
  } catch (err) {
    console.error(err);
  }
};

start();
