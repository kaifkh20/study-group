export const checkLogin = async(req,res,next)=>{
    if(req.cookies.token){
        return res.redirect('/info')
    }
    return next()
}

