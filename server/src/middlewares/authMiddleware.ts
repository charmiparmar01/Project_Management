import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import ERROR from '../messages/errors';

const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    // const refreshToken = authHeader && authHeader.split(' ')[2];

    if (!token) {
        res.status(401).json(ERROR.TOKEN_MISSING);
        return;
    }

    jwt.verify(token, process.env.ACCESS_TOKEN ?? '', (err, user) => {
        // if (refreshToken == null) {
        //     res.status(401).json(ERROR.NO_REFRESH_TOKEN);
        //     return;
        // }
        if (err) {
            res.status(403).json(ERROR.INVALID_TOKEN);
            return;
        }

        // req.user = user;
        next();
    });
}

export default authenticateToken;
