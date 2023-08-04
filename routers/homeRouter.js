const express = require('express')
const {User} = require('../model/user')
const router = express.Router()
const auth = require('../auth/auth')
const checkLogin = require('../auth/checkLogin')
const {Server,Channels,Message} = require('../model/server')

router.use(auth)

router.get('/home',auth,async(req,res)=>{
    res.render('home')
    // res.redirect('/chat?server='+encodeURIComponent('Netaji Subhas'))
})

router.get('/home/server',async(req,res)=>{
    const serverName = req.query.serverName
    // console.log(query);
    const server = await Server.findOne({serverName}).populate('channels')
    // console.log(server.channels);
    res.render('channels',{
        channels : server.channels
    })
})

module.exports = router



