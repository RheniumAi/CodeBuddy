import express from 'express'
import { signup, login, logout,googleAuth, googleAuthCallback } from '../controllers/auth.controller.js'
import passport from  "../config/passport.js"
const router = express.Router()

router.post('/signup', signup)
router.post('/login',login)
router.post('/logout',logout)

// Google Auth Route
router.get('/google', (req, res, next) => {
    console.log('Google login route hit');
    next();
  }, passport.authenticate('google', { scope: ['profile', 'email'] }));
  

// Google Auth Callback Route
router.get("/google/callback", passport.authenticate("google", { failureRedirect: "/login" }), googleAuthCallback);

export default router