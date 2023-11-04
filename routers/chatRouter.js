
import express from 'express'
import {auth} from '../auth/auth.js'
import crypto from 'node:crypto'
import { Server,Channel } from '../model/server.js'
import {join,dirname} from 'node:path'
import { ObjectId } from 'mongodb'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url));

export const chatRouter = express.Router()

chatRouter.get('/chat',auth,async(req,res)=>{

   if(req.query.channelCode === undefined && req.query.userName === undefined){
    res.redirect('/home')
    // res.end()
   }

//    const user = await User.findOne({_id:req.user.id})
//    const channelCodes = user.channels

//    if(!channelCodes.includes(new ObjectId(channelCodes))){
//         res.redirect()
//    }

    res.sendFile(join(__dirname,'../public/chat.html'))
})


chatRouter.get('/chat/createChannel',auth,async(req,res)=>{

    res.render('channelForm',{
        serverName : req.query.serverName
    })
})

chatRouter.post('/chat/createChannel',auth,async(req,res)=>{
    
    // console.log(req.body);
    
     try{
        const channelName = req.body.channelName
        const server = await Server.findOne({serverName:req.body.serverName});
        
        // console.log(await Channel.count({server:server._id,channelName}));
        if( await Channel.count({server:server._id,channelName})>0){
            res.redirect('/chat/createChannel?serverName='+encodeURIComponent(req.body.serverName)+'&error='+encodeURIComponent('Channel Already Exists'))
            res.end()
        }

        else{
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
        }
        
    }catch(e){
        console.log(e);
    }
})

chatRouter.post('/joinChannel',auth,async(req,res)=>{
    try{
        console.log(req.query);
        const user = req.user
        const {channelCode} = req.body
        const channels = await Channel.findOne({channelCode})
        const users = channels.users
        if(users.includes(new ObjectId(user._id))){
            res.redirect('/home/server?serverName='+encodeURIComponent(req.query.serverName)+'&status='+encodeURIComponent('Already Joined'))
        }
        else{
            await Channel.findOneAndUpdate({channelCode},{"$push":{users:user._id}})
            res.redirect('/home/server?serverName='+encodeURIComponent(req.query.serverName)+'&status='+encodeURIComponent('Joined'))
        }
            
    }catch(e){
        console.log(e);
    }
})

chatRouter.get('/test',async(req,res)=>{
   const users = await Channel.findOne({channelCode:'l3sPwewHwlN2nZ1WyPuox8kfKQ6uYkTRtzIeXk_vY-Q'}).populate('users')
   console.log(users.users);
})

