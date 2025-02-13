import expressAsyncHandler from "express-async-handler";
import { validateSignup } from "../lib/validation.js";
import { matchedData, validationResult } from "express-validator";
import prisma from "../lib/prisma.js";
import bcrypt from "bcryptjs";
import getJwtToken from "../lib/getJwtToken.js";

export default {
    post: [
        validateSignup(),
        expressAsyncHandler(async (req, res) => {
            const result = validationResult(req);

            if (!result.isEmpty()) {
                res.status(400).json({ errors: result.array() });

                return;
            }

            const { username, password, firstName, lastName } =
                matchedData(req);

            const user = await prisma.user.create({
                data: {
                    username,
                    firstName,
                    lastName,
                    passwordHash: await bcrypt.hash(password, 10),
                },
                select: { id: true },
            });

            res.json({ token: await getJwtToken({ id: user.id }) });
        }),
    ],
};
