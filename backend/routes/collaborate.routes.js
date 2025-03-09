// Contains the route of the collaboration- Ask ai, end session, upload file, invite friend, live share, mute/unmute

import express from 'express'
import { generateCode } from '../controllers/ai.controller.js'
import {protectRoute} from '../middleware/protectRoute.js'
import rateLimit from 'express-rate-limit';
const router = express.Router()

// Rate limiting middleware
const rateLimiter = rateLimit({
    windowMs: 5 * 60 * 60 * 1000, // 5 hours
    max: 5, 
    message: { message: 'Request limit reached. Try again after 5 hours.' },
    standardHeaders: true, 
    legacyHeaders: false,

    keyGenerator: (req) => {
        return req.user?.email || req.ip; 
    }
});

router.post('/generate-code', protectRoute, rateLimiter, generateCode);

export default router;