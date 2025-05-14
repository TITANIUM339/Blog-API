import { Router } from "express";
import comments from "../../../../controllers/comments.js";
import validatePostAccess from "../../../../middleware/validatePostAccess.js";
import optionalAuth from "../../../../middleware/optionalAuth.js";
import passport from "passport";
import comment from "./comment/index.js";

const router = Router();

const route = "/comments";

router.use(route, comment);

router
    .route(route)
    .post(
        passport.authenticate("jwt", { session: false }),
        validatePostAccess,
        comments.post,
    )
    .get(optionalAuth, validatePostAccess, comments.get);

export default router;
