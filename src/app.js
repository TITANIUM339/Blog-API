import express from "express";
import helmet from "helmet";
import passport from "passport";
import { jwtStrategy, localStrategy } from "./lib/passport.js";
import routes from "./routes/index.js";

const app = express();

app.use(helmet());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

passport.use(jwtStrategy);
passport.use(localStrategy);

app.use(routes);

const PORT = process.env.PORT || 3300;

app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
