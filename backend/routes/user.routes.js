import express from 'express';
import { SignIn, signOut, SignUp } from '../controller/user.controller.js';
import { auth } from '../middleware/auth.js';
const userRouter = express.Router();

userRouter.post('/signup', SignUp);
userRouter.post('/signin', SignIn);
userRouter.get('/signout', auth, signOut);
export default userRouter;