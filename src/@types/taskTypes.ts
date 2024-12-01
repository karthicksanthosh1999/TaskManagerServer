import { Request } from 'express';

export interface ICreateTask extends Request {
    body: {
        _id?: string,
        title: string,
        description: string,
        dueDate: string,
        status: string,
        createdUser: Object,
    }
}

export interface IGetSingleTask extends Request {
    params: {
        id: string,
    }
}

export interface ISearchTask extends Request {
    query: {
        search?: string,
        page?: string,
        limit?: string
    }
}