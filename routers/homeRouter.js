import express from 'express'
import {auth} from '../auth/auth.js'
import { Server } from '../model/server.js'

export const homeRouter = express.Router()

homeRouter.use(auth)

homeRouter.get('/home',auth,async(req,res)=>{
    const user = req.user
    // console.log(user.servers);
    res.render('home',{
        user 
    })
    // res.redirect('/chat?server='+encodeURIComponent('Netaji Subhas'))
})

homeRouter.get('/home/server',auth,async(req,res)=>{
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
