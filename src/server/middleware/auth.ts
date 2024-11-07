import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const jwtSecret = process.env.JWT_SECRET!;

export const authMiddleware = (
	req: Request,
	res: Response,
	next: NextFunction
): void => {
	const token = req.cookies.auth_token;

	if (!token) {
		res.status(401).json({ message: "Unauthorized" });
	}

	try {
		jwt.verify(token, jwtSecret);

		next();
	} catch (error) {
		res.status(401).json({ message: "Invalid or expired token" });
	}
};
