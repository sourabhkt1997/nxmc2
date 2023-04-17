const { BlacklistModel } = require("../model/blacklistmodel")

let jwt=require("jsonwebtoken")
require("dotenv").config()

let auth=async(req,res,next)=>{
  try{
   let {acctoken}=req.cookies
   let data=await BlacklistModel.findOne({token:acctoken})
   if(data){
    res.send("login again")
   }
   else{
    let user=jwt.verify(acctoken,process.env.access)
    if(user){
      req.userid=user.userid
      console.log(user)
      next()
    }
   
   }

   }
   catch(err){
     res.send(err.message)
   }

}

module.exports={auth}