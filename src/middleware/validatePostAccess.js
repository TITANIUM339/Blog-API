import expressAsyncHandler from "express-async-handler";
import { matchedData } from "express-validator";
import prisma from "../lib/prisma.js";
import createHttpError from "http-errors";

export default expressAsyncHandler(async (req, res, next) => {
    const { postId } = matchedData(req);

    const post = await prisma.post.findUnique({
        where: { id: postId },
        select: { published: true, authorId: true },
    });

    if (!post.published && post.authorId !== req.user?.id) {
        next(
            req.isAuthenticated() ? createHttpError(403) : createHttpError(401),
        );

        return;
    }

    next();
});
