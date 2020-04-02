const express = require('express'),
      User = require('../models/user'),
      router = express.Router();

router.get('/calendar', isLoggedIn(), (req, res) => {
    res.redirect('/calendar/' + req.user.username);
})

router.get("/calendar/:username", isLoggedIn(), (req, res) => {
    User.findOne({ username: req.params.username })
    .then((user) => {
        res.render('index', { user: user });
    })
    .catch(() => {
        res.redirect('/');
    });
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
