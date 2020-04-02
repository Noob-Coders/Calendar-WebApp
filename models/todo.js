const mongoose = require("mongoose");

var todoSchema = mongoose.Schema({
    date: Number,
    month: Number,
    year: Number,
    content: String,
    time: String,
    id: String,
    done: Boolean
});

module.exports = mongoose.model("Todo", todoSchema);