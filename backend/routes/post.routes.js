import express from 'express';
import { CreatePost, getFeed, likePost, addComment } from '../controller/post.controller.js';
import { auth } from '../middleware/auth.js';
import { upload } from '../middleware/multer.js';

const postRouter = express.Router();

postRouter.get('/feed', getFeed);
postRouter.post('/create', auth, upload.single('image'), CreatePost);
postRouter.put('/:id/like', auth, likePost);
postRouter.post('/:id/comment', auth, addComment);

export default postRouter;