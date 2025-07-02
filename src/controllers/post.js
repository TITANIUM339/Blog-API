import expressAsyncHandler from "express-async-handler";
import { matchedData } from "express-validator";
import prisma from "../lib/prisma.js";
import { validatePostUpdate } from "../lib/validation.js";
import { validationResult } from "express-validator";

export default {
    get: expressAsyncHandler(async (req, res) => {
        const { postId } = matchedData(req);

        const post = await prisma.post.findUnique({
            where: { id: postId },
            include: {
                author: { select: { firstName: true, lastName: true } },
            },
        });

        res.json({ post });
    }),
    put: [
        validatePostUpdate(),
        expressAsyncHandler(async (req, res) => {
            const result = validationResult(req);

            if (!result.isEmpty()) {
                res.status(400).json({ errors: result.array() });

                return;
            }

            const { postId, ...data } = matchedData(req);

            await prisma.post.update({ where: { id: postId }, data });

            res.sendStatus(200);
        }),
    ],
    delete: expressAsyncHandler(async (req, res) => {
        const { postId } = matchedData(req);

        await prisma.$transaction([
            prisma.comment.deleteMany({ where: { postId } }),
            prisma.post.delete({ where: { id: postId } }),
        ]);

        res.sendStatus(204);
    }),
};
