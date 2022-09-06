const express = require('express'); // IMPORT EXPRESS.JS
const app = express(); // THE APP OBJECT CONVENTIONALLY DEMOTES THE EXPRESS APPLICATION. CREATE IT BY CALLING THE TOP-LEVEL EXPRESS() FUNCTION BY THE EXPRESS MODULE
const path = require('path');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const bodyParser = require('body-parser'); //CREATE AN INSTANCE OF BODY-PARSER
const fs = require('fs'); // INTERACTING WITH THE FILE SYSTEM
const cors = require('cors');

app.use(bodyParser.json()); //MOUNTS THE SPECIFIED MIDDLEWARE FUNCTION AT THE SPECIFIED PATH: THE MIDDLEWARE FUNCTION IS EXECUTED WHEN THE BASE OF THE REQUESTED PATH MATCHES PATH. IN THIS CASE WE ARE USING MIDDLEWARE TO PARSE JSON DATA
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, '../angular-app/dist/angular-app/')));
app.use(cors());

require('./routes.js')(app, path);
require('./socket.js')(app, io);
require('./listen.js')(http);

//ROUTE TO HANDLE LOGIN
app.post('/api/auth', (req, res) => {

    var uname = req.body.username;
    var upassword = req.body.password
    var uemail;
    var urole;
    var userObj;

    fs.readFile('authdata.json', 'utf8', function(err, data) {

    if (err) {
        console.log(err);
        res.send({'username':'','success':false});

    } else {

    userObj = JSON.parse(data);
        for (let i = 0; i < userObj.length; i++) {
            if (userObj[i].name == uname) {

                for (let j = 0; j < userObj.length; j++) {
                    if (userObj[j].password == upassword) {
                        uemail = userObj[j].email;
                        urole = userObj[j].role;
                        res.send({'username':uname, 'password':upassword, 'email':uemail, 'role':urole, 'success':true});
                        return;
                    }
                }
            }
        }
    res.send({'username':uname,'success':false});
    }});
});
    
//Route to retrieve user data
app.post('/api/users', (req, res) => {

    fs.readFile('authdata.json','utf-8', function(err, data) {

        if (err) {
            console.log(err);
        } else {
            var userData = JSON.parse(data);
            res.send({userData});
        }

    });
});

//Route to delete user
app.post('/api/del', (req, res) => {

    var delUname = req.body.username;
    var delUserObj;
  
    fs.readFile('authdata.json','utf-8', function(err, data) {
        if (err) {
            console.log(err);
        } else {
            delUserObj = JSON.parse(data);
  
            for (let i = 0; i < delUserObj.length; i++) {
                if (delUserObj[i].name == delUname) {
                    delete delUserObj[i];
                    break;
                }
            }
            var rawdeldata = delUserObj.filter(o => Object.keys(o).length);
            var newdeldata = JSON.stringify(rawdeldata);
            fs.writeFile('authdata.json',newdeldata,'utf-8',function(err) {
                if (err) throw err;
                res.send({'username':delUname,'success':true});
            });
        }
    });
});

//Route to handle user register
app.post('/api/reg', (req, res) => {

    var regUserObj;
    var regUname = req.body.username;
    var regUpwd = req.body.password
    var regUemail = req.body.email;
    var regUrole = req.body.role;
  
    fs.readFile('authdata.json','utf-8', function(err, data) {
        if (err) {
            console.log(err);
        } else {
            regUserObj = JSON.parse(data);
            regUserObj.push({'name':regUname, 'password':regUpwd, 'email':regUemail, 'role':regUrole})
            var newdata = JSON.stringify(regUserObj);
            fs.writeFile('authdata.json',newdata,'utf-8',function(err) {
                if (err) throw err;
                res.send({'username':regUname, 'password':regUpwd,'email':regUemail, 'role':regUrole,'success':true});
            });
        }
    });
});
  
    
//ROUTE TO RETREIVE GROUP DATA
app.post('/api/groups', (req, res) => {

    fs.readFile('groupdata.json','utf-8', function(err, data) {

        if (err) {
            console.log(err);
        } else {
            var groupData = JSON.parse(data);
            res.send({groupData});
        }

    });
});

//ROUTE TO DELETE GROUP
app.post('/api/delgroup', (req, res) => {

    var delGname = req.body.groupname;
    var delGroupObj;
  
    fs.readFile('groupdata.json','utf-8', function(err, data) {
        if (err) {
            console.log(err);
        } else {
            delGroupObj = JSON.parse(data);
  
            for (let i = 0; i < delGroupObj.length; i++) {
                if (delGroupObj[i].name == delGname) {
                    delete delGroupObj[i];
                    break;
                }
            }
            var rawdeldata = delGroupObj.filter(o => Object.keys(o).length);
            var newdeldata = JSON.stringify(rawdeldata);
            fs.writeFile('groupdata.json',newdeldata,'utf-8',function(err) {
                if (err) throw err;
                res.send({'groupname':delGname,'success':true});
            });
        }
    });
});

//ROUTE TO HANDLE GROUP CREATION
app.post('/api/reggroup', (req, res) => {

    var regGroupObj;
    var regGname = req.body.groupname;
  
    fs.readFile('groupdata.json','utf-8', function(err, data) {
        if (err) {
            console.log(err);
        } else {
            regGroupObj = JSON.parse(data);
            regGroupObj.push({'name':regGname})
            var newdata = JSON.stringify(regGroupObj);
            fs.writeFile('groupdata.json',newdata,'utf-8',function(err) {
                if (err) throw err;
                res.send({'groupname':regGname,'success':true});
            });
        }
    });
});
  