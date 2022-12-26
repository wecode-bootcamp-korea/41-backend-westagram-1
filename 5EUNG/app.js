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

///////////
//Sign up//
///////////
app.post('/signup', async (req, res, next) => {
  const { id, name, email, password } = req.body

  await appDataSource.query(
    `INSERT INTO users(
      id,
      name,
      email,
      password
      ) VALUES (?, ?, ?, ?);
    `,
    [id, name, email, password]
  );

  res.status(201).json({ message: "successfully signed up" });
});
///// Sign up -END- /////

/////////
//Posts//
/////////
app.post('/posts', async (req, res) => {
  const { title, contents } = req.body

  await appDataSource.query(
    `INSERT INTO posts(
      title,
      contents
      ) VALUES (?,?);
    `,
    [title, contents]
  )

  res.status(201).json({ message: "postCreated" });
})
///// Posts -END- /////


const PORT = process.env.PORT;

const start = async () => {
  try {
    app.listen(PORT, () => console.log(`Server is listening on ${PORT}`));
  } catch (err) {
    console.error(err);
  }
};

start()


