import { prisma } from "../../lib/prisma";

export const getUser = async (id: string) => {
	const user = await prisma.user.findUnique({
		where: { id },
	});

	if (user) {
		return user;
	} else {
		return null;
	}
};
