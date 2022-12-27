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
///// 회원가입 -END- /////

//////////////
//Bcrypt 실습//
//////////////
const bcrypt = require("bcrypt"); // (1) bcrypt 모듈 import

const password = '1q2w3e4r'; // (2) 암호화 할 평문
const saltRounds = 12; // (3) Cost Factor

const makeHash = async (password, saltRounds) => {
  return await bcrypt.hash(password, saltRounds); // (4) hash() method로 암호화, 첫번째 인자로 암호화 하고 싶은 평문이 두번째 인자로 Cost Factor가 들어간다.
}

///// Bcrypt 실습 -END- /////

//////////////
//Bcrypt 검증//
//////////////
const checkHash = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword) // (1)
}

const main = async () => {
  const hashedPassword = await makeHash("password", 12);
  console.log(hashedPassword);
  const result = await checkHash("password", hashedPassword);
  console.log(result);
};

main();

// Bcrypt 검증 -END- /////

const PORT = process.env.PORT;

const start = async () => {
  try {
    app.listen(PORT, () => console.log('Server is listening on ${PORT}'));
  } catch (err) {
    console.error(err);
  }
};

start()


