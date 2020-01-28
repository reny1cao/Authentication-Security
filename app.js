//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect("mongodb+srv://new-user_0:Aa_647ron_db@cluster0-0bwlj.mongodb.net/userDB", {useNewUrlParser: true});

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

const User = new mongoose.model("User", userSchema);

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/register", (req, res) => {
    res.render("register");
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.post("/register", (req, res) => {
    bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
        const newUser = new User({
            email: req.body.username,
            password: hash
        });

        newUser.save((err) => {
            if (err) {
                console.log(err);
            } else {
                res.render("secrets");
            }
        });
    });
});

app.post("/login", (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    User.findOne({email: username}, (err, foundUser) => {
        if (err) {
            console.log(err);
        } else {
            bcrypt.compare(password, foundUser.password, (err, result) => {
                if (result === true) {
                    res.render("secrets");
                } else {
                    res.render("Wrong number");
                }
            });
        }
    });
    // User.find({}, (err, userDatas) => {
    //     let email = req.body.email;
    //     let password = req.body.password;
    //     userDatas.forEach(element => {
    //         if (element.email == email && element.password == password) {
    //             res.render("secrets");
    //         }
    //     });
    // });
});

app.listen(3000, () => {
    console.log("Server started at port 3000");
});