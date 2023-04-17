let mongoose=require("mongoose")

let userSchema=mongoose.Schema({

     email:String,
     password:String,
     role:{
        type:String,
        required:true,
        enum:["User","Moderator"],
        default:"User"
     }

},{
    versionKey:false
})

UserModel=mongoose.model("user",userSchema)

module.exports={UserModel}