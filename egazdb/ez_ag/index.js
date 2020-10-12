const express = require("express");
const app = express();
const MongoClient = require('mongodb').MongoClient
const bodyParser= require('body-parser');
const { db } = require("./user");
var ObjectID = require('mongodb').ObjectID;

app.use(bodyParser.json());
app.unsubscribe(bodyParser.urlencoded({extended: true}));

MongoClient.connect('mongodb+srv://anfelix:oaHKXziPb8dZcua3@ezagdb.qf03a.mongodb.net/anfelix?retryWrites=true&w=majority', (err, db) => {
    if (err) return console.log(err)

    app.listen(3000, () =>{
        console.log('app working on 3000')
    });

    let dbase = db.db('userdb')

    app.post('user/add', (req, res, next) => {
        var user = {
            email: req.body.email,
            name: req.body.first_name + " " + req.body.last_name,
            isAdmin: req.body.isAdmin
        };
    
        dbase.collection('user').insertOne(user, (err, result) => {
            if(err) 
                console.log(err);
            
            res.send(result + " has been added");
        });
    });
    
    app.get('/user', (req, res, next) => {
        dbase.collection('user').find().toArray((err, results) =>{
            console.log(results)
            res.send(results)
        });
    });

    app.get('/user/:id', (req, res, next) =>{
       if(err)
        throw err;
        
        let id = ObjectID(req.params.id);
        db.collection('user').find(id).toArray((err, result) =>{
            if(err)
                throw err;
            
            res.send(result);
        })
    });
});

// const mongoClient = require('mongodb').MongoClient
// var ObjectId = require('mongodb').ObjectId;

// MongoClient.connect(
//     'mongodb+srv://dbusers:Cwth149t65ZhMKOY@ezagdb.qf03a.mongodb.net/dbusers?retryWrites=true&w=majority',
//     (err, database) =>{
//         var dbase = db.db("EzAgDb");
//         if(err) return console.log(err)
//         app.listen(3000, () => {
//             console.long('app working on 300')
//         })
//     });
