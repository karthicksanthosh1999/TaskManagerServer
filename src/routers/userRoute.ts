import userController from "../controllers/userController";
import { Router } from 'express';
import { authMiddleware } from "../controllers/authenticationController";
import upload from "../config/multer-config";

const userRouter = Router();

userRouter.post('/create-user', upload.single('profile'), userController.createUser);
userRouter.get('/getAll-users', authMiddleware, userController.getAllUser);
userRouter.get('/single-user/:id', authMiddleware, userController.getSingleUser);

export default userRouter;