const express = require('express')
const {User} = require('../model/user')
const userRouter = express.Router()
const auth = require('../auth/auth')
const checkLogin = require('../auth/checkLogin')
const Uni = require('../model/university')
const randomAvatarGenerator = require("@fractalsoftware/random-avatar-generator");
const svg2img = require('svg2img')
const {Server,Channel,Message} = require('../model/server')

userRouter.get('/',checkLogin,async(req,res)=>{
    res.redirect('/login')
})

userRouter.get('/login',checkLogin,async(req,res)=>{
    res.render('login')
})

userRouter.get('/info',auth,async(req,res)=>{
    try{
        const user = req.user
        
        res.render('profile',{
            username : user.username,
            email : user.email,
            name : user.name,
            avatar : Buffer(user.avatar).toString('base64'),
            gender : user.gender,
            location : user.location,
            university : user.university,
            course : user.course
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
    
    if(req.body.university==="Choose..."){
        res.redirect('/signup?error='+encodeURIComponent('Choose University'))
    }

    const user = new User(req.body)

    const avatar = randomAvatarGenerator.getRandomAvatar()
    
    try{
        await user.save()
        let binary 
        svg2img(avatar, function(error, buffer) {
            //returns a Buffer
          binary = buffer
        });
        await User.findOneAndUpdate({_id:user._id},{avatar:binary})
        await User.findOneAndUpdate({_id:user._id},{"$push":{servers:{serverName:req.body.university}}})
        await User.findOneAndUpdate({_id:user._id},{"$push":{servers:{serverName:"Interests(Global)"}}})
        
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

userRouter.post('/addUniversity',async(req,res)=>{
    // console.log(req.body);

    if(await Uni.count({name:req.body.universityName})>0){
        res.redirect('/addUniversity?error='+encodeURIComponent('Already Exists'))
        res.end()
    }

    const uni = new Uni({
        name : req.body.universityName,
        address : req.body.address,
        website : req.body.universityWebsite
    })
    await uni.save()
    const server = new Server({serverName:req.body.universityName})
    await server.save()
    res.redirect('/signup')
})


userRouter.get('/logout',auth,async(req,res)=>{
    res.clearCookie('token')
    res.redirect('/')
})

module.exports = {userRouter}