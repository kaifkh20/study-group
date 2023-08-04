const express = require('express')
const {User} = require('../model/user')
const userRouter = express.Router()
const auth = require('../auth/auth')
const checkLogin = require('../auth/checkLogin')
const Uni = require('../model/university')


userRouter.get('/',checkLogin,async(req,res)=>{
    res.redirect('/login')
})

userRouter.get('/login',checkLogin,async(req,res)=>{
    res.render('login')
})

userRouter.get('/info',auth,async(req,res)=>{
    try{
        const user = req.user
        userId = user._id
        res.render('profile',{
            username : user.username,
            email : user.email
        })
        
    }catch(e){
        console.log(e);
    }
    res.end()
})

userRouter.get('/signup',checkLogin,async(req,res)=>{
    const university = await Uni.find({})
    // console.log(university[0].name);
    res.render('signup',{
        university
    })
})

userRouter.post('/signup',checkLogin,async(req,res)=>{
    const user = new User(req.body)
    try{
        await user.save()
        res.redirect('/')
    }catch(e){
        const countUsername = await User.count({username : req.body.username});
        const countEmail = await User.count({email:req.body.email});
        if(countUsername>0 && countEmail==0){
            return res.redirect('/signup?error='+encodeURIComponent('Username Exists'))
        }
        else if(countEmail>0 && countUsername==0){
            return res.redirect('/signup?error='+encodeURIComponent('Email in Use'))
        }
        return res.redirect('signup?error='+encodeURIComponent('Username and Email in Use'))  
    }
})

userRouter.post('/login',checkLogin,async(req,res)=>{
    try{
        const user = await User.findByCredentials(req.body.username,req.body.password)
        const token = await user.getAuthToken()
        res.cookie('token',token,{httpOnly:true,secure:true})
        res.redirect('/info')  
    }catch(e){
        console.log(e);
        res.redirect('/login?error='+encodeURIComponent('Incorrect Ceredentials'))
    }
})

userRouter.get('/addUniversity',async(req,res)=>{
    res.render('addUni')
})

userRouter.get('/logout',auth,async(req,res)=>{
    res.clearCookie('token')
    res.redirect('/')
})

module.exports = {userRouter}