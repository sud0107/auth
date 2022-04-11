const mongoose = require("mongoose");

mongoose.connect(process.env.DATABASE, {
    // useNewUrlParse: true,
    // useFindAndModify: true,
    useUnifiedTopology: true
    // useCreateIndex: true
}).then(() => {
    console.log("Database is connect")
}).catch(err => {
    console.log("Ohh No Error ", err);
})