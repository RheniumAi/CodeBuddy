import mongoose from 'mongoose';

// Define the User schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Export the User model
export const User = mongoose.model('User', userSchema);
