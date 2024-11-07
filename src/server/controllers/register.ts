import { hashPassword } from "../../lib/hash";
import { prisma } from "../../lib/prisma";

export const Register = async (
	email: string,
	name: string,
	password: string
) => {
	const hashedPassword = await hashPassword(password);

	const user = await prisma.user.create({
		data: {
			email: email,
			password: hashedPassword,
			name: name,
		},
	});

	const { password: _, ...userWOPassword } = user;
	return userWOPassword;
};
