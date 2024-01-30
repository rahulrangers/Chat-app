import mongoose, { MongooseError } from "mongoose"
const userschema = new mongoose.Schema({
  name:{
    type:String,
    unique:true
  },
  password:{
    type:String
  },
  is_online:{
    type:Boolean,
    default:0
  }

})
export default mongoose.model("User",userschema)