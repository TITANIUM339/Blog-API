import { Router } from "express";
import { validateCommentRoute } from "../../../../../lib/validation.js";
import handleValidationFail from "../../../../../middleware/handleValidationFail.js";
import optionalAuth from "../../../../../middleware/optionalAuth.js";
import validateCommentAccess from "../../../../../middleware/validateCommentAccess.js";
import comment from "../../../../../controllers/comment.js";
import expressAsyncHandler from "express-async-handler";
import { matchedData } from "express-validator";
import prisma from "../../../../../lib/prisma.js";
import createHttpError from "http-errors";
import passport from "passport";

const router = Router();

const route = "/:commentId";

const onlyAllowPostAndCommentAuthor = expressAsyncHandler(
    async (req, res, next) => {
        const { commentId } = matchedData(req);

        const comment = await prisma.comment.findUnique({
            where: { id: commentId },
            include: { post: { select: { authorId: true } } },
        });

        if (
            comment.authorId !== req.user.id &&
            comment.post.authorId !== req.user.id
        ) {
            next(createHttpError(403));

            return;
        }

        next();
    },
);

router.use(route, validateCommentRoute(), handleValidationFail);

router
    .route(route)
    .get(optionalAuth, validateCommentAccess, comment.get)
    .put(
        passport.authenticate("jwt", { session: false }),
        onlyAllowPostAndCommentAuthor,
        comment.put,
    )
    .delete(
        passport.authenticate("jwt", { session: false }),
        onlyAllowPostAndCommentAuthor,
        comment.delete,
    );

export default router;
