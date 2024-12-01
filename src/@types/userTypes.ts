import { Request } from "express";
import { ObjectId } from "mongoose";

export interface ICreateUser extends Request {
    body: {
        firstName: string;
        lastName: string;
        email: string;
        password: string;
        profile: string;
    }
}
export interface IGetSingleUser extends Request {
    params: {
        id: string,
    }
}

export interface ISearchUser extends Request {
    query: {
        search?: string,
        page?: string,
        limit?: string,
        email?: string,
        mobile?: string,
        firstname?: string
    }
}

export interface IMultipleUser extends Request {
    body: {
        ids: []
    }
}