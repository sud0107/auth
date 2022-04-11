const express = require('express');
const mongoose = require('mongoose');
const csrf = require("csurf");
const expressSessions = require("express-session");


const app = express();

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views',);

app.use(express.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/email", {
    // useNewUrlParse: true,
    // useFindAndModify: true,
    useUnifiedTopology: true
    // useCreateIndex: true
}).then(() => {
    console.log("Database is connect")
}).catch(err => {
    console.log("Ohh No Error ", err);
})

app.use(expressSessions({
    secret: "random",
}))

app.use(csrf());

app.use(require('./controller/routes'));

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => console.log("Server Started At " + PORT));