import jwt from 'jsonwebtoken';

export default async function required(req, res, next) {
    let token;
    if (!req.headers["authorization"])
        return res.status(401).json({ message: "No authorization header given.", error: 401, ok: false });
    if(req.headers["authorization"]) {
        if (!req.headers["authorization"].startsWith("Bearer ") && !req.headers["authorization"].startsWith("Bot "))
            return res.status(401).json({ error: 401, ok: false });
        if (req.headers["authorization"].includes("Bearer") && req.headers["authorization"].includes("Bot"))
            return res.status(401).json({ error: 401, ok: false});
        if (req.headers["authorization"].includes("Bearer "))
            token = req.headers["authorization"].split("Bearer ")[1];
        else if (req.headers["authorization"].includes("Bot "))
            token = req.headers["authorization"].split("Bot ")[1];
        await jwt.verify(token, process.env.jwt_secret as string, (err, data) => {
            if(err) return res.status(401).json({ message: 'Unable to authenticate due to token being invalid.', error: 401, ok: false });
            // @ts-ignore
            req.user = data;
            next();
        });
    }
}