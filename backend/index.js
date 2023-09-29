import express from "express"
import mongoose from "mongoose"
import "dotenv/config"
import route from "./routes/userRoute.js"
import cors from "cors"
import bodyParser from "body-parser"


const app = express()


app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use("/", route)
const corsOptions ={
  origin:["http://localhost:5173"], 
  credentials:true,            //access-control-allow-credentials:true
  optionSuccessStatus:200
}
app.use(cors(corsOptions))

const PORT = process.env.PORT || 8000

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL)
    console.log(`mongoDB is connected ${conn.connection.host}`)
  } catch (error) {
    console.log(error, "cannot connect")
  }
}


app.get("/", (req, res) => {
  res.send({"Greetings": "Welcome"})
})


connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
  })
}).catch(err => console.log(err))
