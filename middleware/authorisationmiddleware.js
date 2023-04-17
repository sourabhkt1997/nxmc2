
let authotisation=(authdata)=>{
   let auth=async(req,res,next)=>{
      let userrole=req.role
      if(authdata.include(userrole)){
        next()
      }
      else{
        res.send("you are not authorised to this route")
      }
   }
}

module.exports={authotisation}