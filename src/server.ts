import express, { Response, Request } from 'express';
import { v2 as cloudinary } from 'cloudinary';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import userRouter from './routers/userRoute';
import authRouter from './routers/authRouter';
import { errorHandler } from './middleware/errorHandler';
import cookieParser from 'cookie-parser'
import taskRouter from './routers/taskRouter';


dotenv.config()

const app = express();

app.use(
    cors({
        origin: ["http://localhost:5173"],
        methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
        credentials: true,
    })
);
app.use(express.json())

cloudinary.config({
    cloud_name: 'dclkepvlu',
    api_key: '763287416889231',
    api_secret: 'HTZ6um7bt8XUYFh-Ms4_CPfj53w',
});

// Use cookie-parser middleware
app.use(cookieParser());

// Test page
app.get('/', (req: Request, res: Response) => {
    res.status(200).json({
        message: "Healthe checkup ok fine"
    })
})

// USERS
app.use('/api/user', userRouter)

// AUTH
app.use('/api/auth', authRouter);

// PRODUCT
app.use('/api/task', taskRouter)

app.use(errorHandler);

mongoose.connect(process.env.MONGODB_URL as string).then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`SERVER CONNECTED ON -- http://localhost:${process.env.PORT}`)
    })
}).catch((error) => {
    console.log(error)
})

