import { verifyPassword } from "../../lib/hash";
import { prisma } from "../../lib/prisma";

export const Login = async (email: string, password: string) => {
	const user = await prisma.user.findUnique({
		where: { email },
	});

	if (user && (await verifyPassword(password, user.password))) {
		return user;
	} else {
		return null;
	}
};
