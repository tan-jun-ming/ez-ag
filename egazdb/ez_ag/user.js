const mongoose = require("mongoose");   

const schema = mongoose.schema;

let user = new mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String
    },
    isAdmin: {
        type: Boolean
    }
});

module.exports = mongoose.model("user", user);