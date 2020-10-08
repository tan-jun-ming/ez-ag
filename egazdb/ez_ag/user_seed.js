require('./index');
const mongoose = require("mongoose");
const { User } = require('./user.js');

async function seedUser(){
    console.log("Seeding Users to " + mongoose.connection.name + "...");

    const users = [
        {id: "123", name: "Antonio Felix", email: "anfelix@csumb.edu", isAdmin: true},
        {id: "456", name: "Jun Ming Tan" , email: "jtan@csumb.edu", isAdmin: false},
        {id: "789", name: "Mikal Whaley", email: "mwhaley@csumb.edu", isAdmin: true},
    ];

    const u = await User.find();
    console.log('users: ', u);

}

seedUser();