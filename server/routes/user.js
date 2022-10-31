const express = require('express');
const router = express.Router();
const usercontroller = require('../controllers/userController');



// router.get('/login',(req,res)=>{
//   return res.render('login');
// })
//create, read, search , update
router.get('/login',usercontroller.login); // login form
router.get('/',usercontroller.view); // router to view record
router.post('/',usercontroller.search); // router to search for record
router.get('/signup',usercontroller.signupform); // signup
router.get('/adduser',usercontroller.form); // create form
router.get('/deleterecords',usercontroller.deleterecords); // display  deleted records
router.get('/:id',usercontroller.delete); // delete user record
router.get('/:id',usercontroller.deletepermanetly); // delete permanently.


router.post('/login',usercontroller.login_logic); // login logic
router.post('/signup',usercontroller.signup);
router.post('/adduser',usercontroller.create); // insert into database
router.get('/edituser/:id',usercontroller.edit); // edit user
router.post('/edituser/:id',usercontroller.update); // update user








 module.exports = router;
