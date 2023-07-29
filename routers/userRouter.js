const express = require('express')
const {User} = require('../model/user')
const router = express.Router()
const auth = require('../auth')

router.get('/info',auth,async(req,res)=>{
    try{
        const user = await User.findOne({_id:req.user.id})
        res.status(500).send(user)
    }catch(e){
        console.log(e);
    }
    res.end()
})

router.post('/signup',async(req,res)=>{
    const user = new User(req.body)
    try{
        await user.save()
        res.status(200).send({user})
    }catch(e){
        console.log(e);
        res.end()
    }
})

router.post('/login',async(req,res)=>{
    try{
        const user = await User.findByCredentials(req.body.username,req.body.password)
        const token = await user.getAuthToken()
        res.status(200).send({user,token})    
    }catch(e){
        console.log(e);
        res.status(500).send()
    }
})

module.exports = router