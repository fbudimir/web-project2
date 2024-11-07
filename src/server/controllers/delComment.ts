import { prisma } from "../../lib/prisma";

export const delComment = async (commentId: string) => {
	const comment = await prisma.comment.delete({
		where: { id: commentId },
	});

	return comment;
};
