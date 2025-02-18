import expressAsyncHandler from "express-async-handler";
import { matchedData } from "express-validator";
import prisma from "../lib/prisma.js";

export default {
    get: expressAsyncHandler(async (req, res) => {
        const { postId } = matchedData(req);

        const post = await prisma.post.findUnique({ where: { id: postId } });

        res.json({ post });
    }),
};
