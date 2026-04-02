import express from 'express';
import { getCurrentUser, SignIn, signOut, SignUp } from '../controller/user.controller.js';
import { auth } from '../middleware/auth.js';
const userRouter = express.Router();

userRouter.post('/signup', SignUp);
userRouter.post('/signin', SignIn);
userRouter.get('/me', auth, getCurrentUser);
userRouter.get('/signout', signOut);
export default userRouter;
