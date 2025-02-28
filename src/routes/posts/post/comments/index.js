import { Router } from "express";
import comments from "../../../../controllers/comments.js";
import validatePostAccess from "../../../../middleware/validatePostAccess.js";
import passport from "passport";

const router = Router();

const route = "/comments";

router
    .route(route)
    .post(
        passport.authenticate("jwt", { session: false }),
        validatePostAccess,
        comments.post,
    );

export default router;
