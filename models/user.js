const mongoose = require("mongoose");

var userSchema = mongoose.Schema({
    email: String,
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

module.exports = mongoose.model("User", userSchema);