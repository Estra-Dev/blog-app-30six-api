import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
const route = express.Router()
import multer from 'multer'
import path from 'path'

const corsOptions ={
  origin:["http://localhost:5173", "https://blog-app-30six.onrender.com"], 
  credentials:true,            //access-control-allow-credentials:true
  optionSuccessStatus:200
}
route.use(cors(corsOptions))
route.use(cookieParser())


import { registerUser, getUsers, loginUser, getProfile, logout, createPost, getPosts, getPost, updatePost } from "../controller/user.js"
route.post("/register", registerUser)
route.get("/users", getUsers)
route.post("/login", loginUser)
route.post("/logout", logout)
route.get("/profile", getProfile)


const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, '../blog_30six/frontend/src/assets/')
  },
  filename: function(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    )
  },
})

const upload = multer({ storage: storage })

route.post("/post", upload.single('file'), createPost)
route.get("/posts", getPosts)
route.get("/post/:id", getPost)
route.patch("/post", upload.single('file'), updatePost)

export default route