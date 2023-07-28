const express = require('express')
const mongoose = require('mongoose')
const app = express()
const crypto = require('node:crypto')
const {UserLogin} = require('../model/user')

app.use(express.json())

mongoose.connect('mongodb://127.0.0.1:27017/study-group',{
    useNewUrlParser : true
})

app.post('/signup',async(req,res)=>{
    const {username,email,password} = req.body
    const hash = crypto.createHash('sha256')

    const hashedPass = hash.update(password).digest('hex')
    const user = new UserLogin({username,email,password:hashedPass})
    try{
        await user.save()
    }catch(e){
        console.log(e);
    }
    res.end()
})

module.exports = app