const express = require("express");
const app = express();
const cors = require("cors");
const PORT = 4000;

const { UserSeed } = require('./user_seed.js');

const mongoose = require("mongoose");

let user = require("./user");

app.use(cors());

mongoose.connect("mongodb://127.0.0.1:27017/users", {
    useNewUrlParser: true
});

const router = express.Router();
app.use("/", router);

router.route("/getUser").get(function(req, res){
    user.find({}, function(err, result){
        console.log(result);
        if(err)
            res.send(err);
        else
            res.send(result);
    });
});

const connection = mongoose.connection;


connection.once("open", function(){
    console.log("Connection with MongoDB was successful");
});

app.listen(PORT, function(){
    console.log("Server is running on Port: " + PORT);
});
