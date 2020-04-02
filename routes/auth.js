const express = require('express'),
      User = require('../models/user'),
      passport = require('passport'),
      router = express.Router();

router.get("/login", isLoggedIn(true) ,(req, res) => {
    res.render('login');
});

router.post("/login", passport.authenticate('local', { failureRedirect: "/login" }), (req, res) => {
    res.redirect('/calendar/' + req.body.username);
});

router.get("/register", (req, res) => {
    res.render("register");
});

router.post("/register", (req, res) => {
    var user = {
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        image: req.body.image
    };
    User.register(new User(user), req.body.password, (err, user) => {
        if(err){
            req.flash("error", err.message);
            return res.redirect('/register');
        }
        passport.authenticate('local')(req, res, () => {
            res.redirect('/calendar');
        })
    });
});

router.get("/logout", (req, res) => {
    req.logout();
    res.redirect('/');
});

function isLoggedIn(flag) {
    return (req, res, next) => {
        if(flag){
            if(req.isAuthenticated())
                res.redirect('/calendar');
            return next();
        }
        if(req.isAuthenticated())
            return next();
        res.redirect('/login');
    }
}

module.exports = router;