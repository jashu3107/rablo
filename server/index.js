const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config();

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended : true}))


const PORT = process.env.PORT || 8080

//schema
const schema = mongoose.Schema({
    productId: {
        type: String,
        required: true,
        unique: true
      },
      name: {
        type: String,
        required: true
      },
      price: {
        type: Number,
        required: true
      },
      featured: {
        type: Boolean,
        default: false
      },
      rating: {
        type: Number,
        default: null
      },
      createdAt: {
        type: Date,
        required: true,
        default: Date.now
      },
      company: {
        type: String,
        required: true
      }})

const userModel = mongoose.model("user",schema)


const newSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
})
const collect = mongoose.model("collection",newSchema)


//read
app.get("/",async(req,res)=>{
    const data = await userModel.find({})
    res.json({success : true , data : data})
})

//create data
app.post("/create",async(req,res)=>{
    console.log(req.body)
    const data = new userModel(req.body)
    await data.save()
    res.send({success : true , message : "data saved successfully" , data : data})
})

//update data 
app.put("/update",async(req,res)=>{
    console.log(req.body)
    const {_id,...rest} = req.body
    console.log(rest)
    const data = await userModel.updateOne({_id : _id},rest)
    res.send({success : true , message : "data updated successfully" , data : data})
})

//delete data 
app.delete("/delete/:id",async(req,res)=>{
    const id = req.params.id
    console.log(id)
    const data = await userModel.deleteOne({_id:id})
    res.send({success : true , message : "data deleted successfully" , data : data})
})

mongoose.connect(process.env.MONGOURL,{ useNewUrlParser: true, useUnifiedTopology: true })
.then(()=>{
    console.log("connected to DB"),
    app.listen(PORT,()=>console.log("server is running"))
})
.catch((err)=>console.log(err))

app.post("/login",async(req,res)=>{
    const{email,password}=req.body
    try{
        const check = await collect.findOne({email:email})
        if(check){
            res.json("exist")
        }
        else{
            res.json("notexist")
        }
    }
    catch(e){
        res.json("notexist")
    }
})

app.post("/signup",async(req,res)=>{
    const{email,password}=req.body
    const data={
        email:email,
        password:password
    }
    try{
        const check = await collect.findOne({email:email})
        if(check){
            res.json("exist")
        }
        else{
            await collect.insertMany([data])
            res.json("notexist")
        }
    }
    catch(e){
        res.json("notexist")
    }
})

app.listen(8000,()=>{
    console.log("port connected")
})
