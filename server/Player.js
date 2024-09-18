const mongoose=require('mongoose')
const det=new mongoose.Schema({
    pic:String,
    playerno:String,
    jerseyno:String,
    name:String,
    age:String,
    app:String,
    goal:String,
    assist:String,
    card:String
})
module.exports=mongoose.model('Player',det)