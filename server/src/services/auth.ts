import { GraphQLError } from 'graphql';
import jwt from 'jsonwebtoken';

import dotenv from 'dotenv';
dotenv.config();

// interface JwtPayload {
//   _id: unknown;
//   username: string;
//   email: string,
// }

export const authenticateToken = ( { req }: any) => {
  // const authHeader = req.headers.authorization;
  let token = req.body.token || req.query.token || req.headers.authorization;

  if (req.headers.authorization) {
    token = token.split(' ').pop().trim();
    console.log('Token: ', token);
  }

  if (!token) {
    return { user: null };
  }

  try {
    const data: any = jwt.verify(token, process.env.JWT_SECRET_KEY || '');
    console.log(process.env.JWT_SECRET_KEY);
    console.log('Decoded token: ', data);
    req.user = data;
  } catch (error) {
    console.log('Error message: ', error);
    return { user: null };
  }
  return req;

  // if (authHeader) {
  //   const token = authHeader.split(' ')[1];

  //   const secretKey = process.env.JWT_SECRET_KEY || '';

  //   jwt.verify(token, secretKey, (err, user) => {
  //     if (err) {
  //       return res.sendStatus(403); // Forbidden
  //     }

  //     req.user = user as JwtPayload;
  //     return next();
  //   });
  // } else {
  //   res.sendStatus(401); // Unauthorized
  // }
};

export const signToken = (username: string, email: string, _id: unknown) => {
  const payload = { username, email, _id };
  const secretKey: any = process.env.JWT_SECRET_KEY || '';

  return jwt.sign(payload, secretKey, { expiresIn: '1h' });
};

export class AuthenticationError extends GraphQLError {
  constructor(message: string) {
    super(message, undefined, undefined, undefined, ['UNAUTHENTICATED']);
    Object.defineProperty(this, 'name', { value: 'AuthenticationError' });
  }
};
