import productController from "../controllers/taskController";
import { Router } from "express";
import { authMiddleware } from "../controllers/authenticationController";

const taskRouter = Router();

taskRouter.post('/create-task', authMiddleware, productController.createTask);
taskRouter.get('/single-task/:id', authMiddleware, productController.getSingleTask);
taskRouter.get('/getAll-task', authMiddleware, productController.getAllTasks);
taskRouter.delete('/delete-task/:id', authMiddleware, productController.deleteTask);
taskRouter.put('/update-task/:id', authMiddleware, productController.updateTask)
taskRouter.get('/search-tasks', authMiddleware, productController.searchTask);

export default taskRouter;