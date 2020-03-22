const mongoose = require('mongoose');
      passportLocalMongoose = require('passport-local-mongoose');

var userSchema = mongoose.Schema({
    email: String,
    username: String,
    name: String,
    image: String, 
    password: String,
    todo: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Todo"
        }
    ]
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);