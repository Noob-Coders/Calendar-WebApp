const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const User = require("./models/user");
const Todo = require("./models/todo");
const app = express();

const connectString = "mongodb+srv://ankit1234:ankit1234@cluster0-glzmx.mongodb.net/test?retryWrites=true&w=majority";
const PORT = process.env.PORT || 3000;

mongoose.connect(connectString, { useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
    console.log("Database connected...");
}).catch(() => {
    console.log("Cannot connect to the database...");
});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.set("view engine", "ejs");



var loggedIn = [], index;

app.get("/", (req, res) => {
    var responded = false;
    var ip = req.connection.remoteAddress;
    loggedIn.forEach((userInfo) => {
        if(userInfo.ip === ip){
            res.redirect("/calendar");
            responded = true;
        }
    });
    if(!responded)
        res.render("landing");
});

app.get("/calendar", (req, res) => {
    var responded = false;
    var ip = req.connection.remoteAddress;
    loggedIn.forEach((userInfo) => {
        if(userInfo.ip === ip){
            res.render("index", { user: userInfo.user});
            responded = true;
        }
    });
    if(!responded)
        res.redirect("/login");
});

app.get("/login", (req, res) => {
    var responded = false;
    var ip = req.connection.remoteAddress;
    loggedIn.forEach((userInfo) => {
        if(userInfo.ip === ip){
            res.redirect("/calendar");
            responded = true;
        }
    });
    if(!responded)
        res.render("login");
});

app.post("/login", (req, res) => {
    User.findOne(req.body.user).then(user => {
        if(user)
            loggedIn.push({ ip: req.connection.remoteAddress, user: user });
        res.redirect("/calendar");
    }).catch(() => {
        res.redirect("/login");
    });
    
});

app.get("/register", (req, res) => {
    res.render("register");
});

app.post("/register", (req, res) => {
    User.create(req.body.user).then(() => {
        res.redirect("/login");
    }).catch(() => {
        res.redirect("/register");
    });
});


//Temporary logout route
app.get("/logout", (req, res) => {
    var index = -1;
    for(var i=0;i<loggedIn.length;i++){
        
        if(req.connection.remoteAddress === loggedIn[i].ip){
            index = i;
            break;
        }
    }
    console.log(index);
    if(index > -1)
        loggedIn.splice(index, 1);

    res.redirect("/login");
});

app.get("/notfound", (req, res) => {
    res.render("notfound");
});

app.get("/email", (req, res) => {
    var responded = false;
    loggedIn.forEach((data) => {
        if(req.connection.remoteAddress === data.ip){
            responded = true;
            res.send(JSON.stringify({ email: data.user.email, success: true }));
        }
    });
    if(!responded)
        res.send(JSON.stringify({ success: false }));
});

app.get("/todo/:email", (req, res) => {
    var email = req.params.email;
    User.findOne({email: email}).populate("todo").exec()
    .then((user) => {
        var data = {
            success: true,
            email: email,
            todo: user.todo
        };
        res.send(JSON.stringify(data));
    })
    .catch((err) => {
        res.send(JSON.stringify({ success: false, email: email }));
    })
});

//Todo NEW Route
app.post("/todo", (req, res) => {
    var email = req.body.email;
    var newTodo = req.body.newTodo;
    Todo.create(newTodo)
    .then((todo) => {
        User.findOne({ email: email })
        .then((user) => {
            user.todo.push(todo);
            user.save().then(() => {
                User.findById(user._id).populate("todo").exec().then((savedUser) => {
                    var data = {
                        success: true,
                        email: email,
                        todo: savedUser.todo
                    }
                    res.send(JSON.stringify(data));
                })
                .catch(() => {
                    res.send(JSON.stringify({ success: false }));
                });
            });
            
        })
        .catch(() => {
            res.send(JSON.stringify({ success: false }));
        });
    })
    .catch(() => {
        res.send(JSON.stringify({ success: false }));
    });
});

//Todo DELETE Route
app.delete("/todo", (req, res) => {
    var email = req.body.email;
    var todoId = req.body.todoId;
    Todo.findByIdAndDelete(todoId)
    .then(() => {
        User.findOne({email: email})
        .then((user) => {
            var index = -1;
            for(var i=0; i<user.todo.length; i++){
                if(user.todo[i]._id == todoId){
                    index = i;
                    break;
                }
            }
            if(index !== -1)
                user.todo.splice(index, 1);
            user.save()
            .then(() => {
                User.findOne({ email: email }).populate("todo").exec()
                .then((savedUser) => {
                    var data = {
                        success: true, 
                        email: email, 
                        todo: savedUser.todo
                    }
                    res.send(JSON.stringify(data));
                })
            })
            .catch(() => {
                res.send(JSON.stringify({ success: false }));
            });
        
        })
        .catch(() => {
            res.send(JSON.stringify({success: false}));
        });
    })
    .catch(() => {
        res.send(JSON.stringify({ success: false }))
    });
});

app.get("*", (req, res) => {
    res.redirect("/notfound");
});

//Todolist APIs
app.listen(PORT, () => {
    console.log("Server started visit: http://localhost:3000/");
});
