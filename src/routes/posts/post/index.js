import { Router } from "express";
import post from "../../../controllers/post.js";
import handleValidationFail from "../../../middleware/handleValidationFail.js";
import { validatePostRoute } from "../../../lib/validation.js";
import optionalAuth from "../../../middleware/optionalAuth.js";
import expressAsyncHandler from "express-async-handler";
import prisma from "../../../lib/prisma.js";
import createHttpError from "http-errors";
import { matchedData } from "express-validator";
import passport from "passport";
import validatePostAccess from "../../../middleware/validatePostAccess.js";
import comments from "./comments/index.js";

const router = Router();

const route = "/:postId";

const onlyAllowPostAuthor = expressAsyncHandler(async (req, res, next) => {
    const { postId } = matchedData(req);

    const post = await prisma.post.findUnique({
        where: { id: postId },
        select: { authorId: true },
    });

    if (post.authorId !== req.user.id) {
        next(createHttpError(403));

        return;
    }

    next();
});

router.use(route, validatePostRoute(), handleValidationFail);

router.use(route, comments);

router
    .route(route)
    .get(optionalAuth, validatePostAccess, post.get)
    .put(
        passport.authenticate("jwt", { session: false }),
        onlyAllowPostAuthor,
        post.put,
    )
    .delete(
        passport.authenticate("jwt", { session: false }),
        onlyAllowPostAuthor,
        post.delete,
    );

export default router;
