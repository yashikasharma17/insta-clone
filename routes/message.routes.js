import express from 'express';
import { getmessages, sendmessage } from '../controller/message.controller.js';
const router=express.Router();
router.route('/send/:id').post(sendmessage);
router.route('/all/:id').get(getmessages);
export default router;