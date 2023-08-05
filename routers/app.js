const express = require('express')
const mongoose = require('mongoose')
const app = express()
const {userRouter} = require('./userRouter')
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
const {User} = require('../model/user')
const auth = require('../auth/auth')

const { generateMessage, generateLocationMessage,generateImageMessage} = require('../utils/messages')



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

    

    socket.on('join',async({userName,channelCode})=>{
        const user = await User.findOneAndUpdate({username:userName},{socketId:socket.id})

        socket.join(channelCode)

        let channels = await Channel.findOne({channelCode}).populate('users')
        const users = channels.users
        const channelName = channels.channelName

        io.to(channelCode).emit('roomData',{channelName,users})
        
        

        
        
    })

    socket.on('load100Messages',async({channelCode})=>{
        const channels = await Channel.findOne({channelCode}).populate('messages')
        const messages = channels.messages

        io.to(channelCode).emit('render100Messages',messages)

    })

    socket.on('sendMessage', async({userName,message,channelCode}, callback) => {
        // const user = await User.findOne({socketId:socket.id})
        // const user_id = user._id
        const channel_id = await Channel.findOne({channelCode})._id

        const filter = new Filter()

        if (filter.isProfane(message)) {
            return callback('Profanity is not allowed!')
        }

        const messageTo = new Message({
            username: userName,
            body : message,
            channel_id  
        })
        
        await messageTo.save()

        await Channel.findOneAndUpdate({channelCode},{"$push":{messages:messageTo}})

        io.to(channelCode).emit('message', generateMessage(userName,message))
        callback()
    })
    
    socket.on('sendLocation', ({lat,long,userName,channelCode}, callback) => {
        // const user = getUser(socket.id)
        io.to(channelCode).emit('locationMessage', generateLocationMessage(userName,`https://google.com/maps?q=${lat},${long}`))
        callback()
    })


    socket.on('uploadFiles',({file,channelCode,userName})=>{
        // console.log(file.toString('base64'))
        
        io.to(channelCode).emit('imageLink',generateImageMessage(userName,file.toString('base64')))
        
    })

    // socket.on('send100Messages',({messages,channelCode})=>{
    //     io.to(channelCode).emit('render100Messages',messages)
        
    // })
    
   
    // console.log(user);
    // socket.on('disconnect',async()=>{
    //     await User.findOneAndUpdate({username:userName})
    // })
})
    // var channelCod = n

mongoose.connect(`mongodb+srv://kaiffkhann292:${process.env.PASSWORD_ATLAS}@clusterstudybuddy.kmzfdq7.mongodb.net/?retryWrites=true&w=majority`,{
    useNewUrlParser : true
})


module.exports = server