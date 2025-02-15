import expressAsyncHandler from "express-async-handler";
import getJwtToken from "../lib/getJwtToken.js";

export default {
    post: expressAsyncHandler(async (req, res) => {
        res.json({ token: await getJwtToken({ id: req.user.id }) });
    }),
};
