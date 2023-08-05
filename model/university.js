const mongoose = require('mongoose')

const uniSchema = new mongoose.Schema({
    name :{
        type : String,
        required : true,
        unique : true
    },
    address :{
        type : String,
        required : true
    },
    website :{
        type : String,
        required : true
    }
})

const  Uni = new mongoose.model('Uni',uniSchema)

module.exports = Uni