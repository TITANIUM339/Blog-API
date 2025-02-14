import expressAsyncHandler from "express-async-handler";
import { validatePost } from "../lib/validation.js";
import { matchedData, validationResult } from "express-validator";
import prisma from "../lib/prisma.js";

export default {
    post: [
        validatePost(),
        expressAsyncHandler(async (req, res) => {
            const result = validationResult(req);

            if (!result.isEmpty()) {
                res.status(400).json({ errors: result.array() });

                return;
            }

            const data = matchedData(req);

            await prisma.post.create({
                data: { ...data, authorId: req.user.id },
            });

            res.sendStatus(201);
        }),
    ],
};
