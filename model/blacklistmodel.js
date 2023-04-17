let mongoose=require("mongoose")

let blacklistSchema=mongoose.Schema({
    token:String
},{
    versionKey:false
})

BlacklistModel=mongoose.model("blacklist",blacklistSchema)

module.exports={BlacklistModel}