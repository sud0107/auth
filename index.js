const express = require('express');
require("dotenv").config();
require("./db/connectDB");
const cookieParser = require("cookie-parser");
const csrf = require("csurf");
const expressSessions = require("express-session");
const MemoryStore = require("memorystore")(expressSessions);


const app = express();

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views',);

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser("random"))

app.use(expressSessions({
    secret: "random",
    resave: true,
    saveUninitialized: false,
    maxAge: 60 * 1000,
}))

app.use(csrf());

app.use(require('./controller/routes'));

const PORT = process.env.PORT;

app.listen(PORT, () => console.log("Server Started At " + PORT));