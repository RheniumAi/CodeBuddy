// Contains the route of the collaboration- Ask ai, end session, upload file, invite friend, live share, mute/unmute

import express from 'express'
import { generateCode } from '../controllers/ai.controller.js'
import {protectRoute} from '../middleware/protectRoute.js'
const router = express.Router()

router.post('/generate-code',protectRoute ,generateCode);

export default router;