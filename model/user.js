const mongoose = require('mongoose')
const validator = require('validator')

const userLoginSchema = new mongoose.Schema({
    username : {
        type : String,
        required: true,
        trim: true,
    },
    email:{
        type : String,
        required : true,
        trim : true,
        lowercase : true,
        validate(val){
            if(!validator.isEmail(val)){
                throw new Error('Invalid Email') 
            }
        }
    },
    password:{
        type : String,
        required : true,
        trim : true,
        min : 7
    }
})

const UserLogin = new mongoose.model('UserLogin',userLoginSchema)

module.exports = {
    UserLogin
}