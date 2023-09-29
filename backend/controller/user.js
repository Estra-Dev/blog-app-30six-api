import { RegisteredUser } from "../model/user.js";
import { PostModel } from "../model/post.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const salt = bcrypt.genSaltSync(10);

export const getUsers = async (req, res) => {
  try {
    const users = await RegisteredUser.find({})
    res.json(users)
  } catch (error) {
    console.log(error)
  }
}

export const registerUser = async (req, res) => {
  const {name, password} = req.body

  try {
    
    const userDoc = await RegisteredUser.create({
      name, 
      password: bcrypt.hashSync(password, salt)
    })
    console.log(userDoc)
    res.json({userDoc})


  } catch (error) {
    res.status(400).json(error)
  }
}

export const loginUser = async (req, res) => {
  const {name, password} = req.body
  const userDoc = await RegisteredUser.findOne({name})
  const passOk = bcrypt.compareSync(password, userDoc.password)
  
  if (passOk) {
    //login
    jwt.sign({name, id: userDoc._id}, process.env.SECRET, {}, (err, token) => {
      if (err) {
        throw err
      }else {
        res.cookie("token", token).json({name, id: userDoc._id})
      }
    })
  }else {
    res.status(400).json("wrong credentials")
  }
}

export const getProfile = (req, res) => {
  const {token} = req.cookies
  jwt.verify(token, process.env.SECRET, {}, (err, info) => {
    if (err) throw err
    res.json(info)
  })
}

export const logout = (req, res) => {
  res.cookie("token", "").json("ok")
}

export const createPost = async (req, res) => {

  const {title, summary, value} = req.body

///////////////////////////////////////////

  const {token} = req.cookies
  jwt.verify(token, process.env.SECRET, {}, async (err, info) => {
    if (err) throw err
    try {
      const postDoc = await PostModel.create({
        title,
        summary,
        value,
        cover: req.file.filename,
        author: info.id
      })
      res.json(postDoc)
    } catch (error) {
      console.log("cannot post")
    }
  })

}

export const getPosts = async (req, res) => {
  
  res.json(
    await PostModel.find()
    .populate("author", ["name"])
    .sort({createdAt: -1})
    .limit(20)
    )
}


export const getPost = async (req, res) => {
  const {id} = req.params
  const post = await PostModel.find({_id: id}).populate("author", ["name"])
  res.json(post)
}

export const updatePost = async (req, res) => {
  // res.json({file:req.file})
  let newPath = ""
  if (req.file) {
    newPath = req.file.filename
  }

  const {title, summary, value, id} = req.body

  const {token} = req.cookies
  jwt.verify(token, process.env.SECRET, {}, async (err, info) => {
    if (err) throw err
    const postDoc = await PostModel.findById(id)
    const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id)

    if (!isAuthor) {
      return res.status(400).json("You are not the author")
    }

    await postDoc.updateOne({
      title, 
      summary, 
      value,
      cover: newPath ? newPath : postDoc.cover
    })
    
    res.json(postDoc)
  })
}