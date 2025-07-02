export default {
    get(req, res) {
        // eslint-disable-next-line no-unused-vars
        const { passwordHash, ...user } = req.user;

        res.json(user);
    },
};
