import mongoose from 'mongoose';
const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true ,
    unique: true
  },
  
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },

  password: { 
    type: String, 
    required: false 
  },

  friends: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    default: []
  },

  friendRequest: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    default: []
  },
  bio: { 
    type: String, default: "" ,
  },

  profilePic:{
    type:String,
  } ,
}, {timestamps: true} );

export const User = mongoose.model('User', userSchema);
