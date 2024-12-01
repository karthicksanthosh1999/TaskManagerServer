import { NextFunction, Request, Response } from "express";
import { IUser, USERMODAL } from "../modals/userSchema/userModal";
import { IApiResponse } from "../../src/utilities/Responses";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongoose";

interface IDecodedToken {
  userId: ObjectId,
  password?: string,
  firstName: string,
  lastName: string,
  email: string,
};

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.token;
  try {
    if (!token) {
      const apiRes: IApiResponse<null> = {
        message: "Token Not found!",
        statuscode: 401,
        success: false,
      };
      return res.status(401).json(apiRes);
    }

    const decode = jwt.verify(token, process.env.JWT_KEY as string)
    next();
  } catch (error: unknown) {
    const apiRes: IApiResponse<null> = {
      message: "Internal Server Error",
      statuscode: 500,
      success: false,
      error: (error as Error).message || String(error),
    };
    res.status(500).json(apiRes);
  }
};

export const SignIn = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const findUser = await USERMODAL.findOne({
      $or: [{ email: email }, { phone: email }],
    });

    if (!findUser) {
      const apiErrRes: IApiResponse<null> = {
        message: "User not found!",
        statuscode: 404,
        success: false,
      };

      return res.status(404).json(apiErrRes);
    }

    const isMatch = await bcrypt.compare(password, findUser.password);

    if (!isMatch) {
      const apiErrRes: IApiResponse<null> = {
        message: "Incorrect password!",
        statuscode: 401,
        success: false,
      };

      return res.status(401).json(apiErrRes);
    }

    // Generate JWT Token
    const jwtToken = jwt.sign(
      {
        userId: findUser._id,
        firstName: findUser.firstName,
        lastName: findUser.lastName,
        email: findUser.email
      },
      process.env.JWT_KEY || "jsonkey",
      { expiresIn: "1d" }
    );

    // Set the token in an HTTP-only cookie
    res.cookie('token', jwtToken, {
      httpOnly: true,              // Prevents client-side scripts from accessing the cookie
      secure: process.env.NODE_ENV === 'production', // Ensures the cookie is sent only over HTTPS in production
      sameSite: 'strict',          // Helps protect against CSRF attacks
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    }
    );
    // Send a response to the client
    const apiRes: IApiResponse<IDecodedToken> = {
      message: `Welcome ${findUser.firstName}`,
      statuscode: 200,
      success: true,
      responses: {
        userId: findUser._id,
        firstName: findUser.firstName,
        lastName: findUser.lastName,
        email: findUser.email,
      },
    };

    res.status(200).json(apiRes);
  } catch (error) {
    const apiErrRes: IApiResponse<null> = {
      message: "Internal server error",
      statuscode: 500,
      success: false,
      error: (error as Error).message || String(error),
    };
    res.status(500).json(apiErrRes);
  }
};

export const Logout = async (req: Request, res: Response) => {
  const { token } = req.cookies;
  try {
    if (!token) {
      const apiErrRes: IApiResponse<null> = {
        message: "Token Not found",
        success: false,
        statuscode: 400,
      };

      return res.status(400).json(apiErrRes);
    }

    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "development",
      sameSite: "strict",
    });

    const apiRes: IApiResponse<IUser> = {
      message: "Bye Bye",
      statuscode: 200,
      success: true,
    };
    res.status(200).json(apiRes);
  } catch (error) {
    const apiErrRes: IApiResponse<null> = {
      message: "Internal server error",
      statuscode: 500,
      success: false,
      error: (error as Error).message || String(error),
    };
    res.status(500).json(apiErrRes);
  }
};

export const welcome = async (req: Request, res: Response) => {
  res.status(200).json({
    message: "Welcome",
    statusCode: 200,
    status: true
  })
}

export const tokenDecoder = async (req: Request, res: Response) => {
  const { token } = req.cookies;
  try {
    if (!token) {
      const apiRes: IApiResponse<null> = {
        message: "Token Not found!",
        statuscode: 401,
        success: false,
      };
      return res.status(401).json(apiRes);
    }
    const decode = jwt.verify(token, process.env.JWT_KEY || "jsonkey") as IDecodedToken;
    const data = await USERMODAL.findById(decode.userId);
    if (!data) {
      const apiRes: IApiResponse<null> = {
        message: "Access denied. You don't have permission.",
        statuscode: 401,
        success: false,
      };
      return res.status(401).json(apiRes);
    }
    const apiRes: IApiResponse<IDecodedToken> = {
      message: "Welcome user",
      statuscode: 200,
      success: true,
      responses: decode
    }
    res.status(200).json(apiRes)
  } catch (error: unknown) {
    const apiRes: IApiResponse<null> = {
      message: "Internal Server Error",
      statuscode: 500,
      success: false,
      error: (error as Error).message || String(error),
    };
    res.status(500).json(apiRes);
  }
}