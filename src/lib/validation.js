import { body, query, param } from "express-validator";
import prisma from "../lib/prisma.js";

function getOneTimeNext(next) {
    let nextCalled = false;

    return (value) => {
        if (!nextCalled) {
            nextCalled = true;
            next(value);
        }
    };
}

export function validateSignup() {
    return [
        (req, res, next) => {
            const oneTimeNext = getOneTimeNext(next);

            body("username")
                .trim()
                .notEmpty()
                .withMessage("username is required")
                .isAlphanumeric()
                .withMessage("username must be alphanumeric")
                .bail()
                .custom(async (username) => {
                    let user;

                    try {
                        user = await prisma.user.findUnique({
                            where: { username },
                        });
                    } catch (error) {
                        oneTimeNext(error);

                        return;
                    }

                    if (user) {
                        throw new Error("username already exists");
                    }
                })(req, res, oneTimeNext);
        },
        body("firstName")
            .trim()
            .notEmpty()
            .withMessage("first name is required")
            .isAlpha()
            .withMessage("first name must be alphabetic"),
        body("lastName")
            .trim()
            .notEmpty()
            .withMessage("last name is required")
            .isAlpha()
            .withMessage("last name must be alphabetic"),
        body("password").notEmpty().withMessage("password is required"),
    ];
}

export function validatePost() {
    return [
        body("title").trim().notEmpty().withMessage("title is required"),
        body("content").trim().notEmpty().withMessage("content is required"),
        body("thumbnail")
            .trim()
            .optional({ checkFalsy: true })
            .isURL()
            .withMessage("thumbnail must be a URL"),
        body("published")
            .optional()
            .isBoolean()
            .withMessage("published must be a boolean")
            .toBoolean(),
    ];
}

export function validatePostsQuery() {
    return [
        query("myPosts")
            .optional()
            .isBoolean()
            .withMessage("myPosts must be a boolean")
            .toBoolean(),
        query("published")
            .optional()
            .isBoolean()
            .withMessage("published must be a boolean")
            .toBoolean()
            .custom((_, { req }) => req.query.myPosts === true)
            .withMessage("myPosts must be true when published is provided"),
    ];
}

export function validatePostRoute() {
    return (req, res, next) => {
        const oneTimeNext = getOneTimeNext(next);

        param("postId")
            .isInt({ min: 1 })
            .bail()
            .toInt()
            .custom(async (postId) => {
                let post;

                try {
                    post = await prisma.post.findUnique({
                        where: { id: postId },
                    });
                } catch (error) {
                    oneTimeNext(error);

                    return;
                }

                return post ? Promise.resolve() : Promise.reject();
            })(req, res, oneTimeNext);
    };
}

export function validatePostUpdate() {
    return [
        body("title")
            .trim()
            .optional()
            .notEmpty()
            .withMessage("title is required"),
        body("content")
            .trim()
            .optional()
            .notEmpty()
            .withMessage("content is required"),
        body("thumbnail")
            .trim()
            .optional()
            .isURL()
            .withMessage("thumbnail must be a URL"),
        body("published")
            .optional()
            .isBoolean()
            .withMessage("published must be a boolean")
            .toBoolean(),
    ];
}

export function validateComment() {
    return body("content").trim().notEmpty().withMessage("content is required");
}
