const express = require('express')
const mongoose = require('mongoose')
const app = express()
const crypto = require('node:crypto')
const userRouter = require('./userRouter')

app.use(express.json())
app.use(userRouter)

mongoose.connect('mongodb://127.0.0.1:27017/study-group',{
    useNewUrlParser : true
})


module.exports = app