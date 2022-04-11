var GoogleStrategy = require("passport-google-oauth20").Strategy;
const user = require("../model/user")
const clientId = require("../config/googleData").clientId;
const clientSecret = require("../config/googleData").clientSecret;


module.exports = (passport) => {
  
    passport.use(new GoogleStrategy({
        clientID: clientId,
        clientSecret: clientSecret,
        callbackURL: "http://localhost:3000/google/callback" 
    }, (accessToken, refreshToken, profile, done) => {
        console.log(profile.emails[0].value);

        user.findOne({ email: profile.emails[0].value }).then ((data) => {
            if(data) {
                return done(null, data);
            } else {
                user({
                    username: profile.displayName,
                    email: profile.emails[0].value,
                    googleId: profile.id,
                    password: null,
                    provider: "google",
                    isVerified: true,
                }).save((err, data) => {
                    return done(null, data);
                })
            }
        })
    }
    ))

    passport.serializeUser((user, done) => {
        done(null, user.id);
    })
    passport.deserializeUser((id, done) => {
        user.findById(id, (err, data) => {
            done(err, user);
        })
    })
}