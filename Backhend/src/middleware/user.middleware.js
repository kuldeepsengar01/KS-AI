const jwt = require('jsonwebtoken');

async function authuser(req,res,next){


    try{
    const token = req.cookies.token;

    if(!token){
        return res.status(401).json({
            message:"Unauthorised user"
        })
    }

    const decoded = jwt.verify(token,process.env.JWTSECRET);

    req.user=decoded

    next();
}catch(error){
    res.status(500).json({
        message:'Invalid token'
    })
}
}

module.exports={
    authuser
}