import mongoose from 'mongoose'
import { User } from '../model/user.js'

const messageSchema = new mongoose.Schema({
    username:{
        type : String,
    },
    body:{
        type : String,
        required : true
    },
    channel_id: {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Channel"
    }
},{timestamps:true})

const channelSchema = new mongoose.Schema({
    server: {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Server"
    },
    channelName:{
        type : String,
        required : true
    },
    channelCode : {
        type : String,
        required : true
    },
    
    users : [
        {type : mongoose.Schema.Types.ObjectId,
        ref : "User"}
    ],
    messages : [{ type:mongoose.Schema.Types.ObjectId,
        ref :"Message"}
    ]
})


const serverSchema = new mongoose.Schema({
    serverName :{
        type : String,
        required : true,
        unique : true
    },
    channels :[
        {
            
            type : mongoose.Schema.Types.ObjectId,
            ref : "Channel"
            
        }
    ]
})



export const Server = mongoose.model('Server',serverSchema,'Server')
export const Channel = mongoose.model('Channel',channelSchema,'Channel')
export const Message = mongoose.model('Message',messageSchema,'Message')


