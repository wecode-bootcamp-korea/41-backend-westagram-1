require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bcrypt = require("bcrypt");


const { DataSource } = require('typeorm');

const app = express();

const appDataSource = new DataSource({
  type: process.env.TYPEORM_CONNECTION,
  host: process.env.TYPEORM_HOST,
  port: process.env.TYPEORM_PORT,
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE
})

appDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!")
  })
  .catch((err) => {
    console.error("Error during Data Source initialization", err)
    appDataSource.destroy()
  })

app.use(express.json());
app.use(cors());
app.use(morgan('dev'))

app.get("/ping", (req, res) => {
  res.status(200).json({ message: "pong" })
});

<<<<<<< HEAD
app.post('/signup', async (req, res, next) => {
  const { name, email, profileImage, password } = req.body
=======
app.post('/signup', async (req, res) => {
  const { name, email, profileImage, password } = req.body
  const saltRounds = 12;

  const hashedPassword = await bcrypt.hash(password, saltRounds);
>>>>>>> main

  await appDataSource.query(
    `INSERT INTO users(
      name,
      email,
      profile_image,
      password
      ) VALUES (?, ?, ?, ?);
    `,
<<<<<<< HEAD
    [name, email, profileImage, password]
=======
    [name, email, profileImage, hashedPassword]
>>>>>>> main
  );

  res.status(201).json({ message: "userCreated" });
});
<<<<<<< HEAD

app.post('/posts', async (req, res) => {
  const { title, content, postImage, userId } = req.body
=======
>>>>>>> main

  await appDataSource.query(
    `INSERT INTO posts(
      title,
      content,
      post_image,
      user_id
      ) VALUES (?, ?, ?, ?);
    `,
    [title, content, postImage, userId]
  )

  res.status(201).json({ message: "postCreated" });
})

app.get('/posts', async (req, res) => {
  await appDataSource.query(
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

app.get('/user_post/userId/:userId', async (req, res) => {
  const { userId } = req.params;

  const [userPostList] = await appDataSource.query(
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

//////////////////////
app.patch("/user/post/:id", async function (req, res) {
  const { postId } = req.params;
  const { title, content, postImage } = req.body;

  await appDataSource.query(`
      UPDATE posts
          SET
              title = ?,
              content = ?,
              post_image = ?
  `
    , [title, content, postImage, postId]);

  const updatedPost = await appDataSource.query(
    `SELECT
          u.id AS userId, 
          u.name AS userName, 
          p.id AS postingId, 
          p.title AS postingTitle, 
          p.content AS postingContent
      FROM users u
      INNER JOIN posts p
      ON u.id = p.user_id = 1
  `
    , [postId]);

  res.status(200).json({ data: updatedPost });
});
/////////////////////
app.delete('/post/:postId', async (req, res) => {
  const { postId } = req.params;

  await appDataSource.query(
    `
    DELETE FROM posts
    WHERE id = ?
    `,
    [postId]
  );
  res.status(200).json({ message: 'postingDeleted' });
});
//////////////////////
app.post('/likes', async (req, res) => {
  const { userId, postId } = req.body;

  const [likes] = await appDataSource.query(
    `SELECT
      id
    FROM likes
    WHERE user_id = ?
    AND post_id = ?
      `,
    [userId, postId]
  );

  if (!likes) {
    await appDataSource.query(
      `INSERT INTO likes(
          user_id,
          post_id
      ) VALUES (?, ?);
      `,
      [userId, postId]
    );
  } else {
    await appDataSource.query(
      `DELETE FROM likes
        WHERE likes.id = ?
        `,
      [likes.id]
    );
  }
  res.status(200).json({ message: 'likeCreated' });
});
//////////////////////
const PORT = process.env.PORT;

const start = async () => {
  try {
    app.listen(PORT, () => console.log(`Server is listening on ${PORT}`));
  } catch (err) {
    console.error(err);
  }
};

start()


