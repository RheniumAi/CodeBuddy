const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { z } = require('zod');

const { signup } = require('../controllers/authController');
// Zod validation schemas
const signupSchema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const router = express.Router();

router.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    console.log('Received signup data:', { username, email, password });

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists:', email);
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });

    console.log('Saving user:', newUser);

    const savedUser = await newUser.save();
    console.log('User saved successfully:', savedUser);

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ message: 'Error creating user', error });
  }
});


// Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      console.log('User not found:', email); // Log if the user is not found
      return res.status(400).json({ message: 'User not found' });
    }

    console.log('User found:', user.email); // Log if user is found

    // Log the submitted password and stored hashed password
    console.log('Submitted password:', password);
    console.log('Stored password hash:', user.password);

    // Compare the submitted password with the stored hashed password
    const match = await bcrypt.compare(password, user.password);

    // Log the result of password comparison
    console.log('Password match result:', match);

    if (!match) {
      console.log('Passwords do not match'); // Log if passwords don't match
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // If the passwords match, return a success message
    console.log('Login successful for:', user.email); // Log successful login
    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    console.error('Error during login:', error); // Log any error
    res.status(500).json({ message: 'Error logging in', error });
  }
});


module.exports = router;
