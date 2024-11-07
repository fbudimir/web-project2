import { Request } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { prisma } from "./prisma";

const jwtSecret = process.env.JWT_SECRET!;

interface AuthTokenPayload extends JwtPayload {
	id: string;
}

export const checkAuth = async (req: Request) => {
	const token = req?.cookies?.auth_token;

	if (!token) {
		return null;
	}

	const decoded: AuthTokenPayload = jwt.verify(
		token,
		jwtSecret
	) as AuthTokenPayload;

	if (!decoded) {
		return null;
	}

	const id: string = decoded.id;

	if (!id) {
		return null;
	}

	const user = await prisma.user.findUnique({ where: { id } });

	if (!user || !user.id) return null;

	return user.id;
};
