import { Router } from "express";
import login from "../../controllers/login.js";

const router = Router();

router.post("/log-in", login.post);

export default router;
