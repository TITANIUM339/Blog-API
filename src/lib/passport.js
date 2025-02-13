import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy } from "passport-jwt";
import { ExtractJwt } from "passport-jwt";
import prisma from "./prisma.js";
import bcrypt from "bcryptjs";

export const jwtStrategy = new JwtStrategy(
    {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET,
    },
    async (jwtPayload, done) => {
        try {
            const user = await prisma.user.findUnique({
                where: { id: jwtPayload.id },
            });

            if (user) {
                done(null, user);

                return;
            }
        } catch (error) {
            done(error);

            return;
        }

        done(null, false);
    },
);

export const localStrategy = new LocalStrategy(
    async (username, password, done) => {
        try {
            const user = await prisma.user.findUnique({ where: { username } });

            if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
                done(null, false, { message: "Invalid username or password" });

                return;
            }

            done(null, user);
        } catch (error) {
            done(error);
        }
    },
);
