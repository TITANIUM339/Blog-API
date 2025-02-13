import jwt from "jsonwebtoken";

export default (payload) => {
    return new Promise((resolve, reject) => {
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: "12h" },
            (error, token) => {
                if (error) {
                    reject(error);

                    return;
                }

                resolve(token);
            },
        );
    });
};
