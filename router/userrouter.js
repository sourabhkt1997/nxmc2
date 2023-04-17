let express=require("express")

let userrouter=express.Router()

let {UserModel}=require("../model/usermodel")
let bcrypt=require("bcrypt")
let jwt=require("jsonwebtoken")
const { BlockList } = require("net")
const { BlacklistModel } = require("../model/blacklistmodel")
let {auth}=require("../middleware/authntiMiddleware")
userrouter.post("/register",async(req,res)=>{
    try{
        let{email,password,role}=req.body
        console.log(req.body)
        let user=await UserModel.findOne({email:email})
        if(user){
            res.send({"msg":"already registerd, login please"})
        }
        else{
            bcrypt.hash(password, 5,async(err, hash)=> {
                
                let data=new UserModel({email,password:hash,role})
                await data.save()
                res.status(200).send({"msg":"registration successfull"})

            });
        }    
    }
    catch(err){

        res.status(400).send({"msg":err.msg})
    }
})


userrouter.post("/login",async(req,res)=>{
    try{
       let{email,password}=req.body
        
       let data=await UserModel.findOne({email:email})
       if(!data){
        res.send({"msg":"register first"})
       }
       else{
        bcrypt.compare(password,data.password, function(err, result) {
            
            if(err){
                res.send({"msg":"wrong password"})
            }
            if(result){
                let accesstoken=jwt.sign({"userid":data._id}, process.env.access, { expiresIn:1000*60 });
                let refreshtoken=jwt.sign({"userid":data._id}, process.env.refresh, { expiresIn:1000*60*3 });
                res.cookie("acctoken",accesstoken)
                res.cookie("reftoken",refreshtoken)
                res.send("login success full")
                
            }
        });
       }
    }
    catch(err){
        res.send(err.message)
    }
})

userrouter.post("/logout",async(req,res)=>{
    try{
       let {acctoken,reftoken}=req.cookies
        let  balcklistacc=new BlacklistModel({token:acctoken})
        let  balcklistref=new BlacklistModel({token:reftoken})
        await  balcklistacc.save()
         await  balcklistref.save()

         res.send("blacklisted")
    }
    catch(err){
       res.send(err.message) 
    }
})


userrouter.get("/newtoken",auth,async(req,res)=>{
    try{
        let {reftoken}=req.cookies
        let isblacklisted=await BlacklistModel.findOne({token:reftoken})
        if(isblacklisted){
            res.send("login again")
        }
        else{
            let user=jwt.verify(reftoken,process.env.refresh)
            if(!user){
              res.send("login again ...")
            }
            else{
               let newtoken=jwt.sign({"userid":user._id},process.env.access,{expiresIn:1000*60})
               res.cookie("acctoken",newtoken)
               res.send({"msg":"new access token genarated"})
            }
        }

    }
    catch(err){
        
    }
})

module.exports={userrouter}