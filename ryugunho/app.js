require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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
    const { user } = req.body;
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

port = process.env.PORT;

app.listen(port);



