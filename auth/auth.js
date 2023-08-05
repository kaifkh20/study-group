const jwt = require('jsonwebtoken')
const {User} = require('../model/user')


const auth = async(req,res,next)=>{
    try{
        const token = req.cookies.token
        const decoded = jwt.verify(token,process.env.SECRET_KEY || "exampleKey")
        const user = await User.findOne({_id:decoded._id})
        if(!user){
            throw new Error('No User Found')
        }
        req.token = token
        req.user = user

        next()
    }catch(e){
        res.redirect('/')
    }
}

module.exports = auth