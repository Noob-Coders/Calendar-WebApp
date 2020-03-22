const express = require('express'),
      bodyParser = require('body-parser'),
      mongoose = require('mongoose'),
      methodOverride = require('method-override'),
      passport = require('passport'),
      LocalStrategy = require('passport-local'),
      passportLocalMongoose = require('passport-local-mongoose'),
      User = require('./models/user'),
      Todo = require('./models/todo'),
      app = express();

const connectString = "mongodb+srv://ankit1234:ankit1234@cluster0-glzmx.mongodb.net/test?retryWrites=true&w=majority";
const PORT = process.env.PORT || 3000;

mongoose.connect(connectString, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true}).then(() => {
    console.log("Database connected...");
}).catch(() => {
    console.log("Cannot connect to the database...");
});

app.use(require('express-session')({
    secret: "Calendar app is the best",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.use(methodOverride("_method"));

app.set("view engine", "ejs");

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//var loggedIn = [];

app.get("/", isLoggedIn(true),(req, res) => {
    res.render('landing');
});

app.get('/calendar', isLoggedIn(), (req, res) => {
    res.redirect('/calendar/' + req.user.username);
})

app.get("/calendar/:username", isLoggedIn(), (req, res) => {
    User.findOne({ username: req.params.username })
    .then((user) => {
        res.render('index', { user: user });
    })
    .catch(() => {
        res.redirect('/');
    });
});

app.get("/login", isLoggedIn(true) ,(req, res) => {
    res.render('login');
});

app.post("/login", passport.authenticate('local'), (req, res) => {
    res.redirect('/calendar/' + req.body.username);
});

app.get("/register", (req, res) => {
    res.render("register");
});

app.post("/register", (req, res) => {
    var user = {
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        image: req.body.image
    };
    User.register(new User(user), req.body.password, (err, user) => {
        if(err){
            console.log(err);
            return res.redirect('/register');
        }
        passport.authenticate('local')(req, res, () => {
            res.redirect('/calendar');
        })
    });
});

app.get("/logout", (req, res) => {
    req.logout();
    res.redirect('/');
});

app.get("/notfound", (req, res) => {
    res.render("notfound");
});

app.get("/username", (req, res) => {
    if(req.user)
        res.send(JSON.stringify({ success: true, username: req.user.username }));
    else    
        res.send(JSON.stringify({ success: false }));
});

app.get("/todo/:username", (req, res) => {
    var username = req.params.username;
    User.findOne({username: username}).populate("todo").exec()
    .then((user) => {
        var data = {
            success: true,
            username: username,
            todo: user.todo
        };
        res.send(JSON.stringify(data));
    })
    .catch((err) => {
        res.send(JSON.stringify({ success: false, username: username }));
    })
});

//Todo NEW Route
app.post("/todo", (req, res) => {
    var username = req.body.username;
    var newTodo = req.body.newTodo;
    Todo.create(newTodo)
    .then((todo) => {
        User.findOne({ username: username })
        .then((user) => {
            user.todo.push(todo);
            user.save().then(() => {
                User.findById(user._id).populate("todo").exec().then((savedUser) => {
                    var data = {
                        success: true,
                        username: username,
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
    var username = req.body.username;
    var todoId = req.body.todoId;
    Todo.findByIdAndDelete(todoId)
    .then(() => {
        User.findOne({username: username})
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
                User.findOne({ username: username }).populate("todo").exec()
                .then((savedUser) => {
                    var data = {
                        success: true, 
                        username: username, 
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

app.listen(PORT, () => {
    console.log("Server started visit: http://localhost:3000/");
});
