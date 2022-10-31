const mysql = require('mysql');
const bcrypt = require('bcrypt');
const session = require('express-session');

// creating pool for database
const pool = mysql.createPool({
connectionLimit   :   100,
host              : process.env.DB_HOST,
user              : process.env.DB_USER,
password          : process.env.DB_PASSWORD,
database          : process.env.DB_NAME

 });


// view users
exports.view = (req,res)=>{
    // connecting to the database
     pool.getConnection((err,connection)=>{
        if(err) throw err; // display error if not connected
        console.log('connected as ID ' + connection.threadid); // if connection is successful
        // user the mysql query connection to display record
        connection.query('SELECT * FROM signup WHERE status ="active"', (err,rows)=>{
        // when done with the connection, release it
        connection.release();
        if(!err){
            let removedUser = req.query.removed;
            res.render('home',{rows, removedUser}); // passing rows as object if no error
        }else{
            console.log(err);
        }
        console.log('the data from user table: ',rows);

    });
});

}

// search users
exports.search = (req,res)=>{
    // connecting to the database
    pool.getConnection((err,connection)=>{
        if(err) throw err; // display error if not connected
        console.log('connected as ID ' + connection.threadid); // if connection is successful
        let searchterm = req.body.search;
         // user the mysql query connection to display record
        connection.query('SELECT * FROM signup WHERE fname LIKE ? OR othernames LIKE ?',['%'+searchterm + '%','%'+searchterm + '%'], (err,rows)=>{
        // when done with the connection, release it
        connection.release();
        if(!err){
            res.render('home',{rows}); // passing rows as object if no error
        }else{
            console.log(err);
        }
        console.log('the data from user table: ',rows);

       });
    });
}

// signupform
exports.signupform = (req,res)=>{
          if(req.session.loggedin){
            res.render('signup');
          }else{
          res.render('login',{alert:' please login'});
          }

}
// signup
exports.signup = async (req,res)=>{
      const {fname,othernames,email,phone,comment,password}=req.body;
      const hashpassword = await bcrypt.hash(password, 10);

      // connecting to our database
      pool.getConnection((err,connection)=>{
        if(err) throw err; // display console.error();

        console.log('connected as ID' + connection.threadid); // if successfully connected
        connection.query('INSERT INTO signup SET fname =?,othernames = ?,email = ?,phone=?,comment=?,password = ?',[fname,othernames,email,phone,comment,hashpassword], (err,rows)=>{
          connection.release();
          if(!err){
            res.render('signup',{alert:'user created'});
          }else{
            console.log(err);
          }
            console.log('the data from user table:',rows);
        })

      });
      //res.render('signup');
}

// user login form
exports.login = (req,res)=>{
  if(req.session.loggedin){
     res.render('login');
  }else{
  res.render('login',{alert:' please login '});
  }

}

exports.login_logic = async(req,res)=>{
        const email = req.body.email;
        const fname = req.body.fname;
        const password = req.body.password;
      pool.getConnection((err,connection)=>{
          if(err) throw err; // display error if not connected
          console.log('connected as ID ' + connection.threadid); // if connection is successful
          if(email && password){
              connection.query('SELECT * FROM signup WHERE email=?',[email],async (err,rows)=>{
              connection.release();
              const userExist = rows[0];
              if(userExist){
              console.log(userExist);
                const match = await bcrypt.compare(password, userExist.password)
                console.log(match);
                if (match) {
                 req.session.loggedin = true;
                 req.session.email = email;
                res.redirect('/home');
              }else{
                res.render('login',{alert:' Incorrrect Credentials'});
              }
             }else{
                res.render('login',{alert:' wrong '});
              }
        });
      }else if(email==''){
            res.render('login',{alert:' Enter your email'});
          }else if(password==''){
            res.render('login',{alert:' Enter password'});
          }
        });

}



// create form
        exports.form = (req,res)=>{
          if(req.session.loggedin){
             const email = req.session.email;
            res.render('add-user',{alert:'you are loggedin'+email});
           }else{
           res.render('login',{alert:'please login'});
          }
        }

        //add user into database
        exports.create = (req,res)=>{
                const {fname, othernames, email, phone, comment,password}=req.body;
                // connecting to the database
                pool.getConnection((err,connection)=>{
                    if(err) throw err; // display error if not connected
                    console.log('connected as ID ' + connection.threadid); // if connection is successful
                   //user the mysql query connection to display record
                    connection.query('INSERT INTO signup SET fname = ?,othernames = ?,email=?,phone=?,comment=?,password=?',[fname, othernames,email,phone,comment,password], (err,rows)=>{
                    // when done with the connection, release it
                    connection.release();
                    if(!err){
                        res.render('add-user',{alert:'user created'}); // loading to the right page
                    }else{
                        console.log(err);
                    }
                    console.log('the data from user table: ',rows);

                   });
                });

        }

// edit user

        exports.edit = (req,res)=>{
                // connecting to the database
                pool.getConnection((err,connection)=>{
                    if(err) throw err; // display error if not connected
                    console.log('connected as ID ' + connection.threadid); // if connection is successful
                    // user the mysql query connection to display record
                    connection.query('SELECT * FROM signup WHERE id =?',[req.params.id], (err,rows)=>{
                    // when done with the connection, release it
                    connection.release();
                    if(!err){
                        res.render('edit-user',{rows}); // passing rows as object to the view if no error
                    }else{
                        console.log(err);
                    }
                    console.log('the data from user table: ',rows);

                });
            });

        }


// update user
        exports.update = (req,res)=>{
          if(req.session.loggedin){
            res.render('edit',{alert:'you are loggedin'});
          }else{
            res.render('login',{alert:'please login'});
          }

            const {first_name, last_name, email, phone, comment} = req.body;
            // connecting to the database
            pool.getConnection((err,connection)=>{
                if(err) throw err; // display error if not connected
                console.log('connected as ID ' + connection.threadid); // if connection is successful
                // user the mysql query connection to display record
                connection.query('UPDATE signup SET fname =?, othernames =?, email=?, phone =?, comment=? WHERE id=? ',[fname,othernames,email,phone,comment,req.params.id], (err,rows)=>{
                // when done with the connection, release it
                connection.release();
                if(!err){
                    // if updated, then do this bellow function
                        pool.getConnection((err,connection)=>{
                            if(err) throw err;
                            console.log('connected as ID ' + connection.threadid);
                            connection.query('SELECT * FROM signup WHERE id =?',[req.params.id], (err,rows)=>{
                            connection.release();
                            if(!err){
                                res.render('edit-user',{rows,alert: `${fname} has been updatd` });
                            }else{
                                console.log(err);
                            }
                            console.log('the data from user table: ',rows);
                         });
                     });
                     // end function
               }else{
                    console.log(err);
                   }
                console.log('the data from user table: ',rows);

            });
        });

        }

// delete user record
exports.delete = (req,res)=>{
    //     // connecting to the database
    //     pool.getConnection((err,connection)=>{
    //         if(err) throw err; // display error if not connected
    //         console.log('connected as ID ' + connection.threadid); // if connection is successful
    //     // user the mysql query connection to display record
    //     connection.query('DELETE  FROM user WHERE id =?',[req.params.id], (err,rows)=>{
    //         // when done with the connection, release it
    //         connection.release();
    //         if(!err){
    //             res.redirect('/');
    //         }else{
    //             console.log(err);
    //         }
    //         console.log('the data from user table: ',rows);

    //     });
    // });

        // connecting to the database
                pool.getConnection((err,connection)=>{
                    if(err) throw err; // display error if not connected
                    console.log('connected as ID ' + connection.threadid); // if connection is successful
                // user the mysql query connection to display record
                connection.query('UPDATE  signup SET status =? WHERE id =?',['remove',req.params.id], (err,rows)=>{
                    // when done with the connection, release it
                    connection.release();
                    if(!err){
                        let removedUser = encodeURIComponent('user successfully deleted');
                        res.redirect('/?removed' + removedUser);
                    }else{
                        console.log(err);
                    }
                    console.log('the data from user table: ',rows);

                });
            });

}




// display deleted records
      exports.deleterecords = (req,res)=>{
             // connecting to the database
             pool.getConnection((err,connection)=>{
              if(err) throw err; // display error if not connected
              console.log('connected as ID ' + connection.threadid); // if connection is successful
             // user the mysql query connection to display record
              connection.query('SELECT * FROM signup WHERE status ="remove"', (err,rows)=>{
              // when done with the connection, release it
              connection.release();
              if(!err){
                  res.render('deleterecords',{rows}); // passing rows as object if no error
              }else{
                  console.log(err);
              }
              console.log('the data from user table: ',rows);

          });
      });

      }


// delete permanently
            exports.deletepermanetly = (req,res)=>{
                    // connecting to the database
                    pool.getConnection((err,connection)=>{
                     if(err) throw err; // display error if not connected
                    console.log('connected as ID ' + connection.threadid); // if connection is successful
                    // user the mysql query connection to display record
                    connection.query('DELETE  FROM signup WHERE id =?',[req.params.id], (err,rows)=>{
                        // when done with the connection, release it
                    connection.release();
                      if(!err){
                            res.render('deleterecords');
                        }else{
                            console.log(err);
                        }
                        console.log('the data from user table: ',rows);

                    });
                });

            }
