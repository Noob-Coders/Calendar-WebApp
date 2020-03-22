const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const User = require("./models/user");
const Todo = require("./models/todo");
const Login = require("./models/loggedIn");
const app = express();

const connectString = "mongodb+srv://ankit1234:ankit1234@cluster0-glzmx.mongodb.net/test?retryWrites=true&w=majority";
const PORT = process.env.PORT || 8080;

mongoose.connect(connectString, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false}).then(() => {
    console.log("Database connected...");
}).catch(() => {
    console.log("Cannot connect to the database...");
});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.set("view engine", "ejs");


//var loggedIn = [];

app.get("/", (req, res) => {
    var ip = req.connection.remoteAddress;
    Login.findOne({ ip: ip })
    .then((data) => {
        if(data)
            res.redirect("/calendar");
        else    
            res.render("landing");
    })
    .catch(() => {
        res.render("landing");
    }); 
});

app.get("/calendar", (req, res) => {
    var ip = req.connection.remoteAddress;
    Login.findOne({ ip: ip }).populate("user").exec()
    .then((data) => {
        if(data)
            res.render("index", {user: data.user});
        else    
            res.redirect("/login");
    })
    .catch(() => {
        res.redirect("/login");
    }); 
});

app.get("/login", (req, res) => {
    var ip = req.connection.remoteAddress;
    Login.findOne({ ip: ip })
    .then((data) => {
        if(data)
            res.redirect("/calendar");
        else    
            res.render("login");
    })
    .catch(() => {
        res.render("login");
    }); 
});

app.post("/login", (req, res) => {
    User.findOne(req.body.user).then(user => {
        if(user)
            Login.create({ip: req.connection.remoteAddress, user: user})
            .then(() => {
                res.redirect("/calendar");
            }).catch(() => {
                res.redirect("/login");
            });
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
    Login.findOneAndRemove({ ip: req.connection.remoteAddress}).then(() => {
        res.redirect("/login");
    })
    .catch(() => {
        res.redirect("/login");
    });
});

app.get("/notfound", (req, res) => {
    res.render("notfound");
});

app.get("/email", (req, res) => {
    Login.findOne({ip: req.connection.remoteAddress}).populate("user").exec()
    .then((data) => {
        res.send(JSON.stringify({success: true, email: data.user.email}));
    })
    .catch(() => {
        res.send(JSON.stringify({ success: false }));
    });
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


app.listen(PORT, "192.168.2.249", () => {
    console.log("Server started visit: http://localhost:3000/");
});
