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

app.get("/list", async (req, res) => {
  // res.status(200).json({ message : "merong"})
  await appDataSource.query(
    `SELECT
      users.id,
      users.profile_image,
      posts.id,
      posts.url,
      posts.content
    FROM users
    INNER JOIN posts ON users.id = posts.user_id`,
    (err, rows) => res.status(200).json(rows)
  );

  let posts_list = [];

  for (let i = 0; i < users.length; i++) {
    for (let j = 0; j < posts.length; j++) {
      if (posts[j].user_id == users[i].id) {
        let posts_obj = {};

        posts_obj["userID"] = users[i].id;
        posts_obj["userProfieImage"] = users[i].profile_image;
        posts_obj["postingID"] = posts[i].user_id;
        posts_obj["postingImageUrl"] = posts[i].url;
        posts_obj["postingContent"] = posts[i].content;
        posts_list.push(posts_obj);
      }
    }
  }
  // const posts_all = {};
  // posts_all["data"] = posts_list;

  res.status(200).JSON.stringify(posts_all);
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
  const { title, content, user_id, url } = req.body;

  await appDataSource.query(
    `INSERT INTO posts (
      title,
      content,
      user_id,
      url
    ) VALUES (?, ?, ?, ?);
    `,
    [title, content, user_id, url]
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
