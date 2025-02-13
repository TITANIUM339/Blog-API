import { Router } from "express";
import signup from "../../controllers/signup.js";

const router = Router();

router.post("/sign-up", signup.post);

export default router;
