const express = require("express");
const cors = require("cors");
require('dotenv').config();
const configDB = require('./config/db');
const port = process.env.PORT || 8800
const app = express();
app.use(express.json());
app.use(cors());
configDB();

app.get("/", (req, res) => {
    res.send("first send request");
})

app.listen(port, () => {
    console.log("Connected to db", port);
})
 