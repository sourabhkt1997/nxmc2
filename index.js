let express=require("express")

let app=express()

require("dotenv").config()
let {connection}=require("./db")
const { userrouter } = require("./router/userrouter")
let {blogrouter}=require("./router/blogrouter")
const { auth } = require("./middleware/authntiMiddleware")
app.use(express.json())
cookieParser = require('cookie-parser')
app.use(cookieParser())


app.use("/user",userrouter)

app.use(auth)
app.use('/blog',blogrouter)



app.listen(process.env.port,async()=>{
    
    try{
        await connection
        console.log(`server is ruuning in port ${process.env.port}`)

    }
    catch(err){
        console.log(err)
    }

})