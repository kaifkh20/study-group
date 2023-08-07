const express = require('express')
const {User} = require('../model/user')
const router = express.Router()
const auth = require('../auth/auth')
const checkLogin = require('../auth/checkLogin')
const {Server,Channels,Message} = require('../model/server')

router.use(auth)

router.get('/home',auth,async(req,res)=>{
    const user = req.user
    // console.log(user.servers);
    res.render('home',{
        user 
    })
    // res.redirect('/chat?server='+encodeURIComponent('Netaji Subhas'))
})

router.get('/home/server',auth,async(req,res)=>{
    const serverName = req.query.serverName
    
    const user = req.user
    // console.log(query);
    const server = await Server.findOne({serverName}).populate('channels')
    // console.log(server);
    if(server===null){
        res.redirect('/home')
        res.end()
    }else{
        const channels = server.channels
    // console.log(server.channels);
    res.render('channels',{
        serverName,
        channels,
        username : user.username
    })
    }

    
})

module.exports = router



