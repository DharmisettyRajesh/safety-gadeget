const mongoose=require('mongoose')

const schema=new mongoose.Schema({
    fname:{type:String,required:true},
    lname:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    phoneno:{type:String,required:true,min:10},
    branchid:{type:String,min:0,default:0}
})

module.exports=mongoose.model('signup1',schema);