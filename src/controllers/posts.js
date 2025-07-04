import expressAsyncHandler from "express-async-handler";
import { validatePost } from "../lib/validation.js";
import { matchedData, validationResult } from "express-validator";
import prisma from "../lib/prisma.js";

export default {
    get: expressAsyncHandler(async (req, res) => {
        const result = validationResult(req);

        if (!result.isEmpty()) {
            res.status(400).json({ errors: result.array() });

            return;
        }

        const { myPosts, published, search } = matchedData(req);

        const posts = await prisma.post.findMany({
            where: myPosts
                ? { authorId: req.user.id, published }
                : {
                      published: true,
                      title: { contains: search, mode: "insensitive" },
                  },
            include: {
                author: { select: { firstName: true, lastName: true } },
            },
            orderBy: { title: "asc" },
        });

        res.json({ posts });
    }),
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
