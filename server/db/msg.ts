import mongoose from "mongoose";
const messageschema= new mongoose.Schema({
    user1: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true
      },
      user2: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      messagesUser1: [{
        type: String,
        required: false,
        default: []
      }],
      messagesUser2: [{
        type: String,
        required: false,
        default: []
      }]
})
export default mongoose.model("Messages",messageschema) 