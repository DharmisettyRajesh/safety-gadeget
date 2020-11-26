const express=require('express');
const controllers=require('./controllers/signup.js');


const app=express.Router();
app.post('/signup',controllers.signup);
app.post('/login',controllers.login);

module.exports=app; 