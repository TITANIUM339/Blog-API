import { Router } from "express";
import posts from "../../controllers/posts.js";
import passport from "passport";
import optionalAuth from "../../middleware/optionalAuth.js";

const router = Router();

router
    .route("/posts")
    .get(optionalAuth, posts.get)
    .post(passport.authenticate("jwt", { session: false }), posts.post);

export default router;
