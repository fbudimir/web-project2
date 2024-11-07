import { prisma } from "../../lib/prisma";

export const addComment = async (userId: string, body: string) => {
	const comment = await prisma.comment.create({
		data: { userId, body },
	});

	return comment;
};
