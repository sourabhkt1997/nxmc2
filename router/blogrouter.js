let express=require("express")
const { BlogModel } = require("../model/blogmodel")

let blogrouter=express.Router()
let {authotisation}=require("../middleware/authorisationmiddleware")

blogrouter.get("/",async(req,res)=>{

    try{
        let data=await BlogModel.find()
        res.send(data)
    }
    catch(err){
        res.send(err.message)
    }
})

blogrouter.post("/createblog",async(req,res)=>{
    try{
        let userid=req.userid
        // console.log(userid)
        let {title,content}=req.body
        // console.log(req.body)
         let data=new BlogModel({title:title,content:content,userid:userid})
         await data.save()
         res.status(200),send("new blog created")
    }
    catch(err){
        console.log(err)
        res.send(err.message)
    }
})

blogrouter.delete("/deleteyourblog/:id",async(req,res)=>{

    try{
        let {id}=req.params
        let userid=req.userid
        let data=await BlogModel.findOne({_id:id})
        if(!data){
            res.send("id is not valid")
        }
        else{
        if(data.userid==userid){
        await BlogModel.findByIdAndDelete({_id:id})
        res.send("blog deleted")
        }
        else{
            res.send("this blog is not belongs to you")
        }
    }
    }
    catch(err){
        res.send(err.message)
    }
})



// only for moderator...... 

blogrouter.delete("/deleteblog",authotisation["Moderator"],async(req,res)=>{

    try{
        let {id}=req.params
        await BlogModel.findByIdAndDelete({_id:id})
        res.send("blog deleted")
        
    }
    catch(err){
        res.send(err.message)
    }
})


module.exports={blogrouter}