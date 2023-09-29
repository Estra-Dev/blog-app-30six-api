import { Schema, model } from "mongoose";

const postSchema = new Schema({
  title:String,
  summary: String,
  value: String,
  cover: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: "RegisteredUser"
  }
}, {
  timestamps: true
})

export const PostModel = model ('Posts', postSchema)