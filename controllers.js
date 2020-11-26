const {validationResult}=require('express-validator');
const nodemailer=require('nodemailer');
const bcrypt=require('bcryptjs');
const fast2sms = require('fast-two-sms');

const httperror = require('../Models/http-error');
const signup1=require('../Models/signup.js');
const signup2=require('../Models/signup1.js');
const jwt=require('jsonwebtoken')

const signup = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(
        new httperror('Invalid inputs passed, please check your data.', 422)
      );
    }
    const { fname,lname ,email, phoneno,branchid } = req.body;
  
    let existingUser;
    try {
      existingUser = await signup1.findOne({email: email});
    } catch (err) {
      const error = new httperror(
        'Signing up failed, please try again later.',
        500
      );
      return next(error);
    }
  
    if (existingUser) {
      const error = new httperror(
        'User with this E-mail exists already',
        422
      );
      return next(error);
    }
   var existnumber;
    try {
      existnumber= await signup1.findOne({phoneno: phoneno});
    } catch (err) {
      const error = new httperror(
        'Signing up failed, please try again later.',
        500
      );
      return next(error);
    }
  
    if (existnumber) {
      const error = new httperror(
        'User with this phone number exists already .Please signup with another number.',
        422
      );
      return next(error);
    } 
    const createdUser = new signup1({
      fname,
      lname,
      email,
      phoneno,
      branchid
    });
  
    try {
      await createdUser.save();
    } catch (err) {
      const error = new httperror(
        'Signing up failed, please try again later12.',
        500
      );
      return next(error);
    }
    let token;
    try{
    token=jwt.sign({userId:createdUser.id,email:createdUser.email},"RajeshRockStar",{expiresIn:'1h'});
    } catch (err) {
      const error = new httperror(
        'Signing up failed, please try again later1.',
        500
      );
      return next(error);

    } 
    let transporter=nodemailer.createTransport({
      service:'gmail',
      auth:{
          user:'dharmisettyrajesh009@gmail.com',
          pass:'Rajesh@523'
        },
       tls:{
           rejectUnauthorized:false
       }
       });
       let mailOptions={
           from:'dharmisettyrajesh009@gmail.com',
           to:email,
           subject:'testing',
           html: `
           <h1>Please use the following link to reset your password</h1>
           <p>http://localhost:3000/api/password/reset/${token}</p>
           <hr />
           <p>This email may contain sensetive information</p>
           <p>http:localhost:5000</p>
       `    };
       transporter.sendMail(mailOptions,function(err,data){
           if(err){
               res.json({message:'something went wrong'});
           }
           else{
               res.json({message:'email sent successfully'});
           }
       });
    var options = {authorization : '0kMDadSRITlwYpKcgmQZqBriFzujnoV5UO32xP74e8A6LCyWvN8DMIhgvudKfikqO4RTCZtjXasw0NQ5' , message : 'you are registered successfully with our company for more details contact us' ,  numbers : [phoneno]} 
    fast2sms.sendMessage(options);
    res.status(201).json( {userId:createdUser.id,email : createdUser.email,token:token}); // createdUser includes the PW
  };
  
  const login = async (req, res, next) => {
    const { email, password } = req.body;
  
    let existingUser;
  
    try {
      existingUser = await signup2.findOne({ email: email });
    } catch (err) {
      const error = new httperror(
        'Loggin in failed, please try again later.',
        500
      );
      return next(error);
    }
  
    if (!existingUser ) {
      const error = new httperror(
        'Invalid credentials, could not log you in.',
        401
      );
      return next(error);
    }
    let createduser=false;
    try{
      createduser =await bcrypt.compare(password,existingUser.password);
    }
    catch(err) {
      const error = new httperror(
        'password matching failed',500
      )
      throw error;
    }
    if(!createduser){
      const error = new httperror(
        'crediential are not valid',
        500
      )
    }
    let token;

    try{

        token=jwt.sign({userId:createduser.id,email:createduser.email},"RajeshRockStar",{expiresIn:'1h'});
    
      }
      catch (err) {
      const error = new httperror(

        'Log in failed, please try again later.',
        500
      );

      return next(error);

    }
  
    res.status(201).json({ userId:existingUser.id ,email:existingUser.email,token:token});
  };

  exports.signup=signup;
  exports.login=login;
