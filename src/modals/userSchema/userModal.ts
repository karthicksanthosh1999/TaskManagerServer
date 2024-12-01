import mongoose, { Document, ObjectId, Schema } from 'mongoose';

export interface IUser extends Document {
    _id: ObjectId;
    firstName: string;
    lastName: string;
    mobile: string;
    email: string;
    userType: string;
    password: string;
    // profile: string;
    isValidEmail: boolean,
    isValidMobile: boolean,
    verificationToken?: string
}

const UserSchema: Schema = new Schema<IUser>({
    firstName: {
        type: String,
        trim: true,
        required: [true, "First name is required"]
    },
    lastName: {
        type: String,
        trim: true,
        required: [true, "Last name is required"]
    },
    email: {
        type: String,
        trim: true,
        required: [true, "Email is required"],
        unique: true,
    },
    password: {
        type: String,
        trim: true,
        required: [true, "Password is required"],
        unique: true
    },
    // profile: {
    //     type: String,
    //     trim: true,
    //     required: [true, "Profile is required"]
    // }
}, {
    timestamps: true
})

export const USERMODAL = mongoose.model<IUser>("User", UserSchema)