import { prisma } from "../../lib/prisma";
import { User } from "../../types/user";

export const listUsers = async () => {
	return (await prisma.user.findMany()) as User[];
};
