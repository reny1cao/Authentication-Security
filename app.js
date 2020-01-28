//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect("mongodb+srv://new-user_0:Aa_647ron_db@cluster0-0bwlj.mongodb.net/userDB", {useNewUrlParser: true});

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

const secret = process.env.SECRET;

userSchema.plugin(encrypt, {secret: secret, encryptedFields:['password']});

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
    const newUser = new User({
        email: req.body.email,
        password: req.body.password
    });

    newUser.save((err) => {
        if (err) {
            console.log(err);
        } else {
            res.render("secrets");
        }
    });
});

app.post("/login", (req, res) => {
    let username = req.body.email;
    let password = req.body.password;
    // User.find({}, (err, userDatas) => {
    //     let email = req.body.email;
    //     let password = req.body.password;
    //     userDatas.forEach(element => {
    //         if (element.email == email && element.password == password) {
    //             res.render("secrets");
    //         }
    //     });
    // });
    User.findOne({email: username}, (err, foundUser) => {
        if (err) {
            console.log(err);
        } else {
            if (foundUser.password === password) {
                res.render("secrets");
            } else {
                console.log("wrong password");
            }
        }
    });
});

app.listen(3000, () => {
    console.log("Server started at port 3000");
});