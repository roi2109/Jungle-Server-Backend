const morgan=require("morgan")
const cors=require('cors')
require('dotenv').config()
const express = require('express')
const bcrypt=require('bcrypt')
const app = express()
const PORT=3000
const {connect,User,userValidationWithJoi, Appointment}=require("./db")
connect()
app.use(morgan('dev'))
app.use(cors())
app.use(express.json())


app.post('/sign-up',async(req,res)=>{
  const {error}=userValidationWithJoi(req.body)
  if (error){
    console.log(error)
    return
  }
  const isUserRegistered=await User.findOne({email:req.body.email})
  
  if(isUserRegistered){
    res.status(400).send("user is already registered")
    return
  }
  let user=await new User({name:req.body.name,email:req.body.email,password: await bcrypt.hash(req.body.password,12)}).save()
  res.send(user)
})

app.post('/sign-in',async(req,res)=>{
  console.log(req.body)
  const user=await User.findOne({email:req.body.email})
  
  if(!user){
res.status(404).send("User is not registered")
return
  }
  const isValidPassword=await bcrypt.compare(req.body.password,user.password)
  if (!isValidPassword){
   res.status(400).send("invalid password")
   return
  }
const token=await user.generateToken()
res.send(token)

})

app.post('/make-appointment/:id',async(req,res)=>{
  console.log(req.body.role,"req.body.role")
  const user= await User.findById({_id:req.params.id})
   let appointment=await Appointment.findOne({email:user.email,role:req.body.role})
   console.log(appointment,"52***")
   if(!appointment){
    appointment=await new Appointment({name:user.name,email:user.email,role:req.body.role}).save()
console.log(appointment,"appointment")
    res.send(appointment)
   }else{
   console.log("appointment already made")
   }
   
})



app.get('/appointments',async(req,res)=>{
  try {
    
    const data=await Appointment.find({});
  console.log(data)
  res.send(data)
  } catch (error) {
    console.log(error)
  }
})



app.listen(PORT, () => {
  console.log(`Server started on ${PORT}`)
})
