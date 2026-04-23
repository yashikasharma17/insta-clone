import express from 'express';
import isAuthenticated from '../middleware/isAuthenticated.js';
import upload from '../middleware/multer.js'
import { bookmark, commentpost, createpost, deletepost, dislikepost, getallpost, getuserpost, likepost, viewComment } from '../controller/post.controller.js';
const router=express.Router();
router.route('/createpost').post(isAuthenticated,upload.single('image'),createpost);
router.route('/allpost').get(isAuthenticated,getallpost);
router.route('/userpost/all').get(isAuthenticated,getuserpost);
router.route('/:id/like').get(isAuthenticated,likepost);
router.route('/:id/dislike').get(isAuthenticated,dislikepost);
router.route('/:id/comment').post(isAuthenticated,commentpost);
router.route('/:id/commentall').post(isAuthenticated,viewComment);
router.route('/delete/:id').delete(isAuthenticated,deletepost);
router.route('/bookmark/:id').get(isAuthenticated,bookmark);

export default router;



