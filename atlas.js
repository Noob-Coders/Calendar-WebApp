const mongoose = require("mongoose");

const connectString = "mongodb+srv://ankit_2305:hello1234@cluster0-4c1i3.mongodb.net/test?retryWrites=true&w=majority";
mongoose.connect(connectString, {useNewUrlParser: true, useUnifiedTopology: true});

var userSchema = mongoose.Schema({
    name: String
});

var User = mongoose.model("User", userSchema);

//User.create({name: "Richard"}).then(() => { console.log("User created") }).catch(() => {console.log("Code phat gaya")});
//Hello World

User.find({}).then(users => {
    if(users)
        users.forEach(user => { console.log(user.name); });
}).catch(() => {
    console.log("Error");
});