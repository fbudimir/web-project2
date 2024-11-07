import { prisma } from "../../lib/prisma";

export const listComments = async () => {
	const comments = await prisma.comment.findMany({
		select: { id: true, body: true, user: { select: { name: true } } },
	});

	return comments.map((comment) => ({
		id: comment.id,
		body: comment.body,
		name: comment.user.name,
	}));
};
