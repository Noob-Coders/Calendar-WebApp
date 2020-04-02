const express = require('express'),
      User = require('../models/user'),
      Todo = require('../models/todo'),
      router = express.Router();

router.get("/", isLoggedIn(true),(req, res) => {
    res.render('landing');
});

router.get("/notfound", (req, res) => {
    res.render("notfound");
});

router.get("/username", (req, res) => {
    if(req.user)
        res.send(JSON.stringify({ success: true, username: req.user.username }));
    else    
        res.send(JSON.stringify({ success: false }));
});

router.get("/todo/:username", (req, res) => {
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
router.post("/todo", (req, res) => {
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

router.delete("/todo", (req, res) => {
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

router.put('/todo', (req, res) => {
    Todo.findById(req.body.todoId)
    .then((todo) => {
        todo.done = !todo.done;
        todo.save();
        res.send(JSON.stringify({success: true}));
    })
    .catch(() => {
        res.send(JSON.stringify({ success: false }));
    });
});

router.get("*", (req, res) => {
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

module.exports = router;