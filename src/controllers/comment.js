import { matchedData } from "express-validator";
import expressAsyncHandler from "express-async-handler";
import { validationResult } from "express-validator";
import prisma from "../lib/prisma.js";
import { validateCommentUpdate } from "../lib/validation.js";

export default {
    get: expressAsyncHandler(async (req, res) => {
        const { commentId } = matchedData(req);

        const comment = await prisma.comment.findUnique({
            where: { id: commentId },
        });

        res.json({ comment });
    }),
    put: [
        validateCommentUpdate(),
        expressAsyncHandler(async (req, res) => {
            const result = validationResult(req);

            if (!result.isEmpty()) {
                res.status(400).json({ errors: result.array() });

                return;
            }

            const { commentId, ...data } = matchedData(req);

            await prisma.comment.update({ where: { id: commentId }, data });

            res.sendStatus(200);
        }),
    ],
    delete: expressAsyncHandler(async (req, res) => {
        const { commentId } = matchedData(req);

        await prisma.comment.delete({ where: { id: commentId } });

        res.sendStatus(204);
    }),
};
