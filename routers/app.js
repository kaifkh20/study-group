const express = require('express')
const mongoose = require('mongoose')
const app = express()
const userRouter = require('./userRouter')
const homeRouter = require('./homeRouter')
const chatRouter = require('./chatRouter')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const path = require('path')
const cors = require('cors')
const http = require('http')
const socketio = require('socket.io')
const Filter = require('bad-words')
require('dotenv').config('./')
const {Server,Channel,Message} = require('../model/server')


const { generateMessage, generateLocationMessage,generateImageMessage} = require('../utils/messages')
const {addUser,removeUser,getUser,getUserInRoom} = require('../utils/users')
const { channel } = require('diagnostics_channel')

const publicDirectoryPath = path.join(__dirname, '../public')
const server = http.createServer(app)
const io = socketio(server)

app.use(express.json())
app.use(bodyParser.urlencoded({extended:false}))
app.use(cookieParser())
app.use(cors())
app.set('view engine','ejs')
app.use(express.static(publicDirectoryPath))
app.use(userRouter)
app.use(homeRouter)
app.use(chatRouter)

const getUserFromChannel = async (channelCode)=>{
    return await Channel.findOne({channelCode}).populate('users')

}

io.on('connection',(socket)=>{
    console.log('connected');
    socket.broadcast.emit('message', generateMessage('A new user has joined!'))

    socket.on('channelCode',async(channelCode)=>{
        socket.join(channelCode)
        let users = await Channel.findOne({channelCode}).populate('users')
        let channelName = users.channelName
        users = users.users
        io.to(channelCode).emit('roomData',{channelName,users})
    })
    // var channelCod = null
    


    

})


mongoose.connect(`mongodb+srv://kaiffkhann292:${process.env.PASSWORD_ATLAS}@clusterstudybuddy.kmzfdq7.mongodb.net/?retryWrites=true&w=majority`,{
    useNewUrlParser : true
})


module.exports = server