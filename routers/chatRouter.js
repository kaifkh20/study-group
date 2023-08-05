const express = require('express')
const {User} = require('../model/user')
const router = express.Router()
const auth = require('../auth/auth')
const checkLogin = require('../auth/checkLogin')
const crypto = require('node:crypto')
const {Server,Channel,Message} = require('../model/server')
const path = require('path')

router.get('/chat',auth,async(req,res)=>{

   if(req.query.channelCode === undefined && req.query.userName === undefined){
    res.redirect('/home')
    // res.end()
   }

    res.sendFile(path.join(__dirname,'../public/chat.html'))
})

// router.post('/chat',auth,async(req,res)=>{
//     const user = req.user
//     const body = "req.body.message"
//     const channel_id = await Channel.findOne({channelName:"BCA"})
//     const message = new Message({
//         user_id : user._id,
//         body,
//         channel_id
//     })
//     await message.save()
//     await Channel.findOneAndUpdate({_id:channel_id},{"$push":{'messages':message._id}})
//     res.redirect('/chat')
// })

router.get('/chat/createChannel',auth,async(req,res)=>{

    res.render('channelForm',{
        serverName : req.query.serverName
    })
})

router.post('/chat/createChannel',auth,async(req,res)=>{
    
    console.log(req.body);
    
     try{
        const channelName = req.body.channelName
        if(await Channel.count({channelName})>0){
            res.redirect('/chat/createChannel?serverName='+encodeURIComponent('Netaji Subhas University')+'&error='+encodeURIComponent('Channel Already Exists'))
            res.end()
        }
        let server = await Server.findOne({serverName:req.body.serverName})
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
        
        res.redirect('/home/server?serverName='+encodeURIComponent(req.body.serverName))
    }catch(e){
        console.log(e);
    }
})

router.get('/test',async(req,res)=>{
   const users = await Channel.findOne({channelCode:'l3sPwewHwlN2nZ1WyPuox8kfKQ6uYkTRtzIeXk_vY-Q'}).populate('users')
   console.log(users.users);
})

module.exports = router