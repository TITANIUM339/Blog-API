import expressAsyncHandler from "express-async-handler";
import { validateComment } from "../lib/validation.js";
import { matchedData, validationResult } from "express-validator";
import prisma from "../lib/prisma.js";

export default {
    post: [
        validateComment(),
        expressAsyncHandler(async (req, res) => {
            const result = validationResult(req);

            if (!result.isEmpty()) {
                res.status(400).json({ errors: result.array() });

                return;
            }

            const data = matchedData(req);

            await prisma.comment.create({
                data: { ...data, authorId: req.user.id },
            });

            res.sendStatus(201);
        }),
    ],
};
