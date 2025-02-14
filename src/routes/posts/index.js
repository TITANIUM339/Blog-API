import { Router } from "express";
import posts from "../../controllers/posts.js";
import passport from "passport";

const router = Router();

router.post(
    "/posts",
    passport.authenticate("jwt", { session: false }),
    posts.post,
);

export default router;
