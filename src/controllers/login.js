import expressAsyncHandler from "express-async-handler";
import passport from "passport";
import getJwtToken from "../lib/getJwtToken.js";

export default {
    post: [
        passport.authenticate("local", { session: false }),
        expressAsyncHandler(async (req, res) => {
            res.json({ token: await getJwtToken({ id: req.user.id }) });
        }),
    ],
};
