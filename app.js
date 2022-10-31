const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mysql = require ('mysql');
const bcrypt = require('bcrypt');
const session = require('express-session');
// dot env file for database credentials
require('dotenv').config();

const app = express();

const port = process.env.PORT || 5000;
// passing the middleware
// pass application via url
app.use(bodyParser.urlencoded({ extended: false}));
// pass application / json
app.use(bodyParser.json());
//setting up static folder for files
app.use(express.static('public'));
// templating engine
app.engine('hbs', exphbs.engine( {extname: '.hbs' }));
app.set('view engine','hbs');

// creating pool for database
const pool = mysql.createPool({
    connectionLimit   :   100,
    host              : process.env.DB_HOST,
    user              : process.env.DB_USER,
    password          : process.env.DB_PASSWORD,
    database          : process.env.DB_NAME

});
        // creat session
        app.use(session({
         secret: 'secret',
         resave: true,
         saveUninitialized: true
        }));

// connecting to the database
pool.getConnection((err,connection)=>{
    // if(err) throw err; // display error if not connected
    // console.log('connected as ID ' + connection.threadid); // if connection is successful
     if(err){
         console.log(err);
     }else{
         console.log('connection ID '+ connection.threadId);
     }
});

const routes = require ('./server/routes/user');
app.use('/',routes);



app.listen(port, ()=>console.log(`app listening at port ${port}`));



// INYA ABEL OKO
// 3073692635
// First bank
