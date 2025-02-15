import { Router } from "express";
import login from "../../controllers/login.js";
import passport from "passport";

const router = Router();

router.post(
    "/log-in",
    passport.authenticate("local", { session: false }),
    login.post,
);

export default router;
