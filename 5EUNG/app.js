require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

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


// health check 
app.get("/ping", (req, res) => {
  res.status(200).json({ message: "pong" })
});

//////////
//회원가입//
//////////
app.post('/signup', async (req, res, next) => {
  const { name, email, profileImage, password } = req.body

  await appDataSource.query(
    `INSERT INTO users(
      name,
      email,
      profile_image,
      password
      ) VALUES (?, ?, ?, ?);
    `,
    [name, email, profileImage, password]
  );

  res.status(201).json({ message: "successfully signed up" });
});
///// 회원가입 -END- /////

////////////
//게시물 게시//
////////////
app.post('/posts', async (req, res) => {
  const { title, content, postImage, userId } = req.body

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
///// 게시물 게시 -END- /////



const PORT = process.env.PORT;

const start = async () => {
  try {
    app.listen(PORT, () => console.log(`Server is listening on ${PORT}`));
  } catch (err) {
    console.error(err);
  }
};

start()


