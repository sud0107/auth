const user = require("../model/user");
const bcryptjs = require("bcryptjs");
const localStrategy = require("passport-local").Strategy;

module.exports = (passport) => {
    passport.use(new localStrategy({ usernamefield: "email" }, (email, password, done) => {
        user.findOne({ email: email }, (err, data) => {
            if(err) throw err;
            if(!data) {
                return done(null, false, { message: "User doesn't exist !!" })
            }
            bcryptjs.compare(password, data.password, (err, match) => {
                if(err) {
                    return done(null, false);
                }
                if(!match) {
                    return done(null, false, { message: "Password doesn't match" })
                }
                if(match) {
                    return done(null, data);
                }
            })
        })
    }));

    passport.serializeUser((user, done) => {
        done(null, user.id);
    })
    passport.deserializeUser((id, done) => {
        user.findById(id, (err, data) => {
            done(err, user);
        })
    })
}