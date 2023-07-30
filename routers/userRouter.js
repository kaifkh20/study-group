const express = require('express')
const {User} = require('../model/user')
const router = express.Router()
const auth = require('../auth/auth')
const checkLogin = require('../auth/checkLogin')

router.get('/',checkLogin,async(req,res)=>{
    res.render('login')
})


router.get('/info',auth,async(req,res)=>{
    try{
        const user = await User.findOne({_id:req.user.id})
        res.render('profile',{
            username : user.username,
            email : user.email
        })
    }catch(e){
        console.log(e);
    }
    res.end()
})

router.get('/signup',async(req,res)=>{
    res.render('signup')
})

router.post('/signup',async(req,res)=>{
    const user = new User(req.body)
    try{
        await user.save()
        res.redirect('/')
    }catch(e){
        console.log(e);
        res.end()
    }
})

router.post('/login',async(req,res)=>{
    try{
        const user = await User.findByCredentials(req.body.username,req.body.password)
        const token = await user.getAuthToken()
        res.cookie('token',token,{httpOnly:true,secure:true})
        res.redirect('/info')  
    }catch(e){
        res.status(500).send("Error")
    }
})

router.get('/logout',async(req,res)=>{
    res.clearCookie('token')
    res.redirect('/')
})

module.exports = router