import { Schema, model } from "mongoose";

const registerSchema = new Schema({
  name: {
    type: String,
    unique: [true, "This name has already been taken"],
    required: true,
    minLength: [4, "name is too short"],
  },
  password: {
    type: String,
    minLength: [6, "Password should not be less than 6 characters"],
    required: true
  }
})


export const RegisteredUser = model ("RegisteredUser", registerSchema)