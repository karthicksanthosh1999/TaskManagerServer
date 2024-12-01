import express from "express";
import { authMiddleware, Logout, SignIn, tokenDecoder, welcome } from "../controllers/authenticationController";

const authRouter = express.Router();

authRouter.post("/signin", SignIn);
authRouter.get("/logout", Logout);
authRouter.get('/', authMiddleware, welcome)
authRouter.get('/decode', authMiddleware, tokenDecoder)

export default authRouter;