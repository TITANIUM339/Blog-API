import { Router } from "express";
import post from "./post/index.js";
import posts from "../../controllers/posts.js";
import passport from "passport";
import optionalAuth from "../../middleware/optionalAuth.js";
import createHttpError from "http-errors";
import { validatePostsQuery } from "../../lib/validation.js";

const router = Router();

const route = "/posts";

router.use(route, post);

router
    .route(route)
    .get(
        optionalAuth,
        validatePostsQuery(),
        (req, res, next) => {
            const { myPosts, published } = req.query;

            if (
                (myPosts !== undefined || published !== undefined) &&
                !req.isAuthenticated()
            ) {
                next(createHttpError(401));

                return;
            }

            next();
        },
        posts.get,
    )
    .post(passport.authenticate("jwt", { session: false }), posts.post);

export default router;
