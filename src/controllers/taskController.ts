import { NextFunction, Request, RequestHandler, Response } from "express";
import { ICreateTask } from "../@types/taskTypes";
import { ITask, TASKMODAL } from "../modals/productSchema/taskModal";
import { currentDateWithTime, IApiResponse } from "../helper/apiResponse";
import { FilterQuery } from "mongoose";
import { createError } from "../utilities/createError";

class TaskController {

    private populatedData = { path: 'createdUser', select: "-createdAt -updatedAt -__v" }

    createTask: RequestHandler = async (req: ICreateTask, res: Response, next: NextFunction): Promise<void> => {
        const { title, description, createdUser, dueDate, status } = req.body;
        try {
            if (!title || !description || !dueDate) {
                throw createError("Please fill the all input fields", 400)
            }
            const data = await TASKMODAL.create({
                title,
                description,
                dueDate,
                createdUser,
                status
            });
            if (!data) {
                throw createError("Task not created", 400)
            }
            const populatedTask = await data.populate(this.populatedData)
            res.status(201).json({
                message: "Task Created Successfully",
                statusCode: 201,
                success: true,
                responses: populatedTask
            })
        } catch (error) {
            next(error)
        }
    }

    getAllTasks: RequestHandler = async (req: ICreateTask, res: Response, next: NextFunction): Promise<void> => {

        try {
            const data = await TASKMODAL.find().populate(this.populatedData).sort({ createAt: -1 });
            res.status(200).json({
                message: "Task fetch successfully",
                statusCode: 200,
                success: true,
                responses: data
            })
        } catch (error) {
            next(error)
        }
    }

    getSingleTask: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { id } = req.params;
        try {
            const data = await TASKMODAL.findById(id).populate(this.populatedData);
            if (!data) {
                throw createError('Task not found', 400)
            }
            res.status(200).json({
                message: "Task fetched successfully",
                statusCode: 200,
                success: true,
                responses: data,
            });
        } catch (error) {
            next(error)
        }
    }

    deleteTask: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { id } = req.params;
        try {
            const data = await TASKMODAL.findByIdAndDelete(id).populate(this.populatedData);
            if (!data) {
                throw createError('Task not found', 400)
            }
            const populatedTask = await data.populate(this.populatedData)
            res.status(200).json({
                message: "Task deleted successfully",
                statusCode: 200,
                success: true,
                responses: populatedTask,
            });
        } catch (error) {
            next(error)
        }
    }

    updateTask: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { id } = req.params;
        try {
            const data = await TASKMODAL.findByIdAndUpdate(id, req.body, { new: true });
            if (!data) {
                throw createError('Task not found', 400)
            }
            const populatedTask = await data.populate(this.populatedData)
            res.status(201).json({
                message: "Task updated successfully",
                statusCode: 201,
                success: true,
                responses: data
            })
        } catch (error) {
            next(error)
        }

    }

    searchTask: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { search, page = 1, limit = 10 } = req.query;

        try {
            const pageNumber = parseInt(page as string, 10);
            const limitNumber = parseInt(limit as string, 10);
            const skip = (pageNumber - 1) * limitNumber;

            const query: FilterQuery<ITask> = {};

            if (search) {
                query.$or = [
                    { title: { $regex: search, $options: "i" } },
                    { description: { $regex: search, $options: "i" } },
                    { status: { $regex: search, $options: "i" } }
                ]
            }

            const task = await TASKMODAL.find(query).skip(skip).limit(limitNumber).populate(this.populatedData).sort({ createAt: -1 });
            const totalProductes = await TASKMODAL.countDocuments(query);
            res.status(200).json({
                message: "Task fetch successfully",
                statusCode: 200,
                success: true,
                responses: {
                    task,
                    pagination: {
                        currentPage: pageNumber,
                        totalPages: Math.ceil(totalProductes / limitNumber),
                        totalProductes,
                    },
                },
            });

        } catch (error) {
            next(error)
        }
    }
}

export default new TaskController()