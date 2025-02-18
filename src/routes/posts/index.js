import { Router } from "express";
import post from "./post/index.js";
import posts from "../../controllers/posts.js";
import passport from "passport";
import optionalAuth from "../../middleware/optionalAuth.js";

const router = Router();

const route = "/posts";

router.use(route, post);

router
    .route(route)
    .get(optionalAuth, posts.get)
    .post(passport.authenticate("jwt", { session: false }), posts.post);

export default router;
