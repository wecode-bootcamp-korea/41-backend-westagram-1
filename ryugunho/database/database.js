require("dotenv").config();

const { DataSource } = require("typeorm");

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

module.exports = {
    appDataSource
}