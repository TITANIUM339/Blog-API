import { Router } from "express";
import passport from "passport";
import user from "../../controllers/user.js";

const router = Router();

router.get("/user", passport.authenticate("jwt", { session: false }), user.get);

export default router;
