require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bcrypt = require('bcrypt');
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

const PORT = process.env.PORT;

const start = async () => {
  try {
    app.listen(PORT, () => console.log(`server is listening on ${PORT}🔥🔥🔥🔥🔥🔥🔥`));
  } catch (err) {
    console.error(err);
  }
};

start();
