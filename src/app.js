import express from "express";
import helmet from "helmet";
import passport from "passport";
import { jwtStrategy, localStrategy } from "./lib/passport.js";
import routes from "./routes/index.js";
import createHttpError from "http-errors";
import cors from "cors";

const app = express();

app.use(helmet());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(
    cors({
        origin: [
            process.env.CORS_ORIGIN_BLOG_ADMIN,
            process.env.CORS_ORIGIN_BLOG,
        ],
    }),
);

passport.use(jwtStrategy);
passport.use(localStrategy);

app.use(routes);

app.use((req, res, next) => next(createHttpError(404)));
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
    const code = err.statusCode || 500;

    if (code >= 500) {
        console.error(err);
    }

    res.sendStatus(code);
});

const PORT = process.env.PORT || 3300;

app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
