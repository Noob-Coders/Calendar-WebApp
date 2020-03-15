const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

var loggedIn = [], index;

app.get("/", (req, res) => {
    var ip = req.connection.remoteAddress;
    loggedIn.forEach((userInfo) => {
        if(userInfo.ip === ip){
            res.redirect("/calendar");
        }
    });
    res.render("landing");
});

app.get("/calendar", (req, res) => {
    var ip = req.connection.remoteAddress;
    loggedIn.forEach((userInfo) => {
        if(userInfo.ip === ip){
            res.render("index", { userName: userInfo.userName});
        }
    });
    res.redirect("/login");
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.post("/login", (req, res) => {
    console.log(req.body);
    loggedIn.push({ ip: req.connection.remoteAddress, userName: req.body.user.username });
    res.redirect("/calendar");
});

app.get("/notfound", (req, res) => {
    res.render("notfound");
});

app.get("*", (req, res) => {
    res.redirect("/notfound");
})

app.listen(3000, () => {
    console.log("Server started visit: http://localhost:3000/");
});