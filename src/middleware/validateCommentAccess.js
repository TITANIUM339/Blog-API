import expressAsyncHandler from "express-async-handler";
import { matchedData } from "express-validator";
import prisma from "../lib/prisma.js";
import createHttpError from "http-errors";

export default expressAsyncHandler(async (req, res, next) => {
    const { commentId } = matchedData(req);

    const comment = await prisma.comment.findUnique({
        where: { id: commentId },
        include: { post: { select: { published: true, authorId: true } } },
    });

    if (
        !comment.post.published &&
        comment.authorId !== req.user?.id &&
        comment.post.authorId !== req.user?.id
    ) {
        next(
            req.isAuthenticated() ? createHttpError(403) : createHttpError(401),
        );

        return;
    }

    next();
});
