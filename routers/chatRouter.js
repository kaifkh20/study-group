const express = require('express')
const {User} = require('../model/user')
const router = express.Router()
const auth = require('../auth/auth')
const checkLogin = require('../auth/checkLogin')
const crypto = require('node:crypto')
const {Server,Channel,Message} = require('../model/server')
const path = require('path')

router.get('/chat',auth,async(req,res)=>{

    const user = req.user
    
    const channelName = req.query.channelName

    res.sendFile(path.join(__dirname,'../public/chat.html'))
})

router.post('/chat',auth,async(req,res)=>{
    const user = req.user
    const body = "req.body.message"
    const channel_id = await Channel.findOne({channelName:"BCA"})
    const message = new Message({
        user_id : user._id,
        body,
        channel_id
    })
    await message.save()
    await Channel.findOneAndUpdate({_id:channel_id},{"$push":{'messages':message._id}})
    res.redirect('/chat')
})

router.get('/chat/createChannel',auth,async(req,res)=>{
    try{
        const channelName = "BCA"
    if(Channel.count({channelName})>0){
        console.log('Already Created');
        res.end()
    }
    let server = await Server.findOne({serverName:"Netaji Subhas University"})
    const server_id = server._id
    const channelCode = crypto.randomBytes(32).toString('base64url')
    
    const channel = new Channel({
        server : server_id,
        channelName,
        channelCode,
        'users' : req.user._id 
    })

    await channel.save()
    await Server.findOneAndUpdate({_id:server_id},{"$push":{'channels':channel._id}})
    
    res.end()
    }catch(e){
        console.log(e);
    }
})

router.get('/test',async(req,res)=>{
   const users = await Channel.findOne({channelCode:'l3sPwewHwlN2nZ1WyPuox8kfKQ6uYkTRtzIeXk_vY-Q'}).populate('users')
   console.log(users.users);
})

module.exports = router