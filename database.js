const mongoose = require("mongoose");
require('dotenv').config()

const USERNAME = process.env.DB_USERNAME;
const PASSWORD = process.env.DB_PASSWORD;
const DB = process.env.DB;
const URI = `mongodb+srv://${USERNAME}:${PASSWORD}@cluster0.l4ntc.mongodb.net/${DB}`;

class Database {
    constructor() {
        this._connect();
    }

    _connect() {
        mongoose.connect(`${URI}`)
            .then(() => {
                console.log("Database Connection Successful")
            })
            .catch(err => {
                console.log("Database Connection Failed");
                console.log(err.message);
            });
    }
}

module.exports = new Database();