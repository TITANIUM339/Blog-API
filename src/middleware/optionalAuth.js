import passport from "passport";

export default (req, res, next) => {
    passport.authenticate("jwt", (err, user) => {
        if (err) {
            next(err);

            return;
        }

        user && req.login(user, { session: false });

        next();
    })(req, res, next);
};
