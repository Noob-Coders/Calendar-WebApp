const mongoose = require("mongoose");

var loginSchema = mongoose.Schema({
    ip: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
});

module.exports = mongoose.model("Login", loginSchema);