const express = require('express')
const mongoose = require('mongoose')
const app = express()
const userRouter = require('./userRouter')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
require('dotenv').config()

app.use(express.json())
app.use(bodyParser.urlencoded({extended:false}))
app.use(cookieParser())
app.set('view engine','ejs')
app.use(express.static('public'))
app.use(userRouter)


mongoose.connect('mongodb://127.0.0.1:27017/study-group',{
    useNewUrlParser : true
})


module.exports = app