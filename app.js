const express = require('express');
const mongoose = require('mongoose');
const bodyparser=require('body-parser');
const authorization=require('./routes/signup.js');
const httperror=require('./routes/Models/http-error')
const app=express();
app.use(bodyparser.json());
app.use('/api',authorization);
app.use((req, res, next) => {
    const error = new httperror("Could not find this route.", 404);
    throw error;
  });
  
  app.use((error, req, res, next) => {
    if (res.headerSent) {
      return next(error);
    }
    res.status(error.code || 500);
    res.json({ message: error.message || "An unknown error occurred!" });
  });
mongoose.connect(
    `mongodb+srv://Ramu:Ramu123@cluster0-grn1p.mongodb.net/smadmin?retryWrites=true&w=majority`,{useNewUrlParser:true,useUnifiedTopology:true}
  
)
.then(()=>{
    app.listen(process.env.PORT|| 5000);
    console.log('connected');
})
.catch((err)=>{
    console.log(err);
});
