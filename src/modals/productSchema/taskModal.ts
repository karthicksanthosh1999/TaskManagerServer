import mongoose, { Document, model, ObjectId, Schema } from 'mongoose';

export interface ITask extends Document {
    _id: string,
    title: string,
    description: string,
    status: "Queue" | "Pending" | "Completed",
    dueDate: Date,
    createdUser: ObjectId
}

const productSchema: Schema = new Schema<ITask>({
    title: {
        type: String,
        trim: true,
        required: [true, "Title is required"]
    },
    description: {
        type: String,
        trim: true,
        required: [true, "Description is required"]
    },
    status: {
        type: String,
        default: 'Queue',
        enum: ["Queue", "Pending", "Completed"]
    },
    dueDate: {
        type: Date,
        trim: true
    },
    createdUser: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }

}, {
    timestamps: true
})

export const TASKMODAL = model<ITask>("Task", productSchema);