const jwt = require('jsonwebtoken')
const {User} = require('./model/user')
const {ObjectId} = require('mongodb')

const auth = async(req,res,next)=>{
    try{
        const token = req.header('Authorization').replace('Bearer ','')
        const decoded = jwt.verify(token,process.env.SECRET_KEY)
        const user = await User.findOne({_id:decoded._id,'tokens.token':token})
        if(!user){
            throw new Error()
        }
        req.token = token
        req.user = user

        next()
    }catch(e){
        console.log(e);
        res.status(404).send({'error':'Please Authenticate'})
    }
}

module.exports = auth