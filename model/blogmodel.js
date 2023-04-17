let mongoose=require("mongoose")

let blogSchema=mongoose.Schema({
     title:String,
     content:String,
     userid:String
},{
    versionKey:false
})

BlogModel=mongoose.model("blogs",blogSchema)

module.exports={BlogModel}