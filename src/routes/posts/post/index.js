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

const router = Router();

const route = "/:postId";

router.use(route, validatePostRoute(), handleValidationFail);

router
    .route(route)
    .get(
        optionalAuth,
        expressAsyncHandler(async (req, res, next) => {
            const { postId } = matchedData(req);

            const post = await prisma.post.findUnique({
                where: { id: postId },
                select: { published: true, authorId: true },
            });

            if (!post.published && post.authorId !== req.user?.id) {
                next(
                    req.isAuthenticated()
                        ? createHttpError(403)
                        : createHttpError(401),
                );

                return;
            }

            next();
        }),
        post.get,
    )
    .put(
        passport.authenticate("jwt", { session: false }),
        expressAsyncHandler(async (req, res, next) => {
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
        }),
        post.put,
    );

export default router;
