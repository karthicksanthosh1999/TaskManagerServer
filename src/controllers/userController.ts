import { USERMODAL, IUser } from '../modals/userSchema/userModal';
import { Response } from 'express';
import { IApiResponse } from '../helper/apiResponse';
import { hash } from 'bcrypt';
import { NextFunction, RequestHandler } from 'express-serve-static-core';
import { ICreateUser, IGetSingleUser, IMultipleUser, ISearchUser } from '../@types/userTypes';
import { UploadApiResponse, v2 as cloudinary } from "cloudinary";
import { FilterQuery } from 'mongoose';
import { createError } from '../utilities/createError';

class userController {

    createUser: RequestHandler = async (req: ICreateUser, res): Promise<void> => {

        const { email, firstName, password, lastName } = req.body;
        if (req.file) {
            const uploadResult = await new Promise<UploadApiResponse>((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    { folder: "User" },
                    (error, result) => {
                        if (error) {
                            reject(error)
                        } else if (result) {
                            resolve(result)
                        } else {
                            reject(new Error("Upload failed with no result"))
                        }
                    }
                )
                uploadStream.end(req.file?.buffer)

            });
            if (!uploadResult) {
                throw new Error("Upload failed, Problem in img uplaod file")
            }
        }
        const hashedPassword = await hash(password, 10);

        const data = await USERMODAL.create({
            firstName,
            lastName,
            password: hashedPassword,
            email,
        })
        const apiRes: IApiResponse<IUser> = {
            message: "User created successfully",
            statusCode: 201,
            success: true,
            responses: data
        }
        res.status(201).json(apiRes)


    }

    getSingleUser: RequestHandler<{ id: string }> = async (req: IGetSingleUser, res): Promise<void> => {
        const { id } = req.params;
        try {
            const data = await USERMODAL.findById(id);
            if (!data) {
                throw createError("Data not found", 404)
            }
            res.status(200).json({
                message: "User fetch successfully",
                statusCode: 100,
                success: true,
                responses: data
            })
        } catch (error) {

        }
    }

    getAllUser: RequestHandler = async (req: ICreateUser, res: Response, next: NextFunction): Promise<void> => {
        try {
            const data = await USERMODAL.find().sort({ createdAt: -1 });
            res.status(200).json({
                message: "User fetch successfully",
                status: true,
                statusCode: 200,
                responses: data
            })
        } catch (error) {
            next(error)
        }
    }
}

export default new userController();
