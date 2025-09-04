import jwt from 'jsonwebtoken';
require('dotenv').config();

interface TokenPayload {
  permission: {
    username: string;
    email: string;
    userId: string;
    roleId: string;
    roleName: string;
  };
}

const generateAccessToken = (user: TokenPayload) => {
    return jwt.sign(user, process.env.ACCESS_TOKEN ?? '', { expiresIn: '7d' });
}

const generateRefreshToken = (user: TokenPayload) => {
    return jwt.sign(user, process.env.REFRESH_TOKEN ?? '', { expiresIn: '7d' });
}

export { generateAccessToken, generateRefreshToken, TokenPayload };
