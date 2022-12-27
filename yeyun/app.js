require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { DataSource } = require("typeorm");

const app = express();

const appDataSource = new DataSource({
  type: process.env.TYPEORM_CONNECTION,
  host: process.env.TYPEORM_HOST,
  port: process.env.TYPEORM_PORT,
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,
});

appDataSource
  .initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
  })
  .catch((err) => {
    console.log(err.message);
  });

const PORT = process.env.PORT;

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.get("/ping", (req, res) => {
  res.status(200).json({ message: "pong" });
});

app.get("/posts", async (req, res) => {
  const postData = await appDataSource.query(
    `SELECT
              users.id as userId,
              users.profile_iamge as userProfileImage,
              posts.id as postingId,
              posts.content as postingContent
          FROM posts
      INNER JOIN users ON users.id = posts.user_id;
      `,
    (err, rows) => {
      return res.status(200).json({ data: rows });
    }
  );
});

app.get("/pcheck/:userId", async (req, res) => {
  const { userId } = req.params;
  const pcheck = await appDataSource.query(
    `SELECT
        users.id as userId,
        users.profile_iamge as userProfileImage,
        JSON_ARRAYAGG(JSON_OBJECT(
          "postingId" , posts.id,
          "postingImage", posts.imageurl,
          "postContent", posts.content)) as postings
        FROM posts
      INNER JOIN users ON users.id = posts.user_id
      WHERE posts.user_id = ?;
    `,
    [userId]
  );
  return res.status(200).json({ data: pcheck });
});

app.post("/users", async (req, res, next) => {
  const { name, email, password } = req.body;

  await appDataSource.query(
    `INSERT INTO users (
      name,
      email,
      password
    ) VALUES (?, ?, ?);
    `,
    [name, email, password]
  );

  res.status(201).json({ message: "userCreated" });
});

app.post("/posts", async (req, res, next) => {
  const { title, content, user_id, imageurl } = req.body;

  await appDataSource.query(
    `INSERT INTO posts (
      title,
      content,
      user_id,
      imageurl
    ) VALUES (?, ?, ?, ?);
    `,
    [title, content, user_id, imageurl]
  );

  res.status(201).json({ message: "postCreated" });
});

const start = async () => {
  try {
    app.listen(PORT, () => console.log(`Server is listening on ${PORT}`));
  } catch (err) {
    console.error(err);
  }
};

start();
