const express = require("express");
const router = express.Router();
const user = require("../model/user");
const bcryptjs = require("bcryptjs");
const bcrypt = require("bcryptjs/dist/bcrypt");
const passport = require("passport");
require("./passportLocal")(passport);

const checkAuth = (req, res, next) => {
    if(req.isAuthenticated()){
        next();
    } else {
        res.redirect("/")
    }
}

router.get("/", (req, res) => {
  res.render("index");
});

router.get("/login", (req, res) => {
  res.render("login", { csrfToken: req.csrfToken() });
});

router.get("/signup", (req, res) => {
  res.render("signup", { csrfToken: req.csrfToken() });
});

router.post("/signup", (req, res) => {
  const { email, username, password, confirmpassword } = req.body;

  if (!email || !username || !password || !confirmpassword) {
    res.render("signup", {
      err: "All field must be filled",
      csrfToken: req.csrfToken(),
    });
  } else if (password != confirmpassword) {
    res.render("signup", {
      err: "Password don't match",
      csrfToken: req.csrfToken(),
    });
  } else {
    user.findOne(
      { $or: [{ email: email }, { username: username }] },
      (err, data) => {
        if (err) throw err;
        if (data) {
          res.render("signup", {
            err: "User already exist, Try some other username or email",
            csrfToken: req.csrfToken(),
          });
        } else {
            bcryptjs.genSalt(12, (err, salt) => {
                if(err) throw err;
                bcryptjs.hash(password, salt, (err, hash) => {
                    if(err) throw err;
                    user({
                        username: username,
                        email: email,
                        password: hash,
                        isVerified: isVerified,
                        googleId: null,
                        provider: "email",
                    }).save((err, data) => {
                        if(err) throw err;
                        res.redirect("/login");
                    })
                })
            })
        }
      }
    );
  }
});

router.post("/login", (req, res, next) => {
    passport.authenticate("local", {
        failureRedirect: "/login",
        successRedirect: "/profile",
        failureFlash: true,
    })(req, res, next);
})

// router.get("/profile", checkAuth, (req, res) => {
//     res.render("profile", { username: req.user.username })
// });

router.get("/profile", (req, res) => {
    res.render("profile")
})

module.exports = router;
