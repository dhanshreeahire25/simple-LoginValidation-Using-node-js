const express = require('express');
const http = require('http');
const bcrypt = require('bcrypt');
const path = require('path');
const bodyparser = require('body-parser');
const users = require('./data').userDB;
const app = express();
const server = http.createServer(app);
app.use(bodyparser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,'./public')));

// Styling for success and failure messages
const successStyle = "background-color: #c1f7d5; padding: 20px; border-radius: 8px; margin: 20px auto; max-width: 400px;";
const errorStyle = "background-color: #ffcccc; padding: 20px; border-radius: 8px; margin: 20px auto; max-width: 400px;";

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'./public/index.html'));
});

app.post('/register', async (req, res) => {
    try{
        let foundUser = users.find((data) => req.body.email === data.email);
        if (!foundUser) {
    
            let hashPassword = await bcrypt.hash(req.body.password, 10);
    
            let newUser = {
                id: Date.now(),
                username: req.body.username,
                email: req.body.email,
                password: hashPassword,
            };
            users.push(newUser);
            console.log('User list', users);
    
            // Success message with style
            res.send(`<div align ='center' style="${successStyle}"><h2>Registration successful</h2></div><br><br><div align='center'><a href='./login.html'>login</a></div><br><br><div align='center'><a href='./registration.html'>Register another user</a></div>`);
        } else {
            // Error message with style
            res.send(`<div align ='center' style="${errorStyle}"><h2>Email already used</h2></div><br><br><div align='center'><a href='./registration.html'>Register again</a></div>`);
        }
    } catch{
        res.send("Internal server error");
    }
});

//login
app.post('/login', async (req, res) => {
    try{
        let foundUser = users.find((data) => req.body.email === data.email);
        if (foundUser) {
    
            let submittedPass = req.body.password; 
            let storedPass = foundUser.password; 
    
            const passwordMatch = await bcrypt.compare(submittedPass, storedPass);
            if (passwordMatch) {
                let usrname = foundUser.username;
                // Success message with style
                res.send(`<div align ='center' style="${successStyle}"><h2>Login successful</h2></div><br><br><br><div align ='center'><h3>Hello ${usrname}</h3></div><br><br><div align='center'><a href='./login.html'>logout</a></div>`);
            } else {
                // Error message with style
                res.send(`<div align ='center' style="${errorStyle}"><h2>Invalid password</h2></div><br><br><div align ='center'><a href='./login.html'>login again</a></div>`);
            }
        }
        else {    
            // Error message with style
            res.send(`<div align ='center' style="${errorStyle}"><h2>Invalid email</h2></div><br><br><div align='center'><a href='./login.html'>login again<a><div>`);
        }
    } catch{
        res.send("Internal server error");
    }
});

server.listen(3000,function(){
    console.log("server is listening on port 3000");
});