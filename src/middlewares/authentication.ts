import { Request } from 'express';
import * as jwt from 'jsonwebtoken';

import { CONFIG } from '../config';

// CONFIGURE YOUR TOKEN PAYLOAD
export function signToken(payload: { userId: string }) {
  const token = jwt.sign(payload, CONFIG.JWT.SECRET, { expiresIn: '2h' });

  return token;
}

// eslint-disable-next-line consistent-return
export function expressAuthentication(
  request: Request,
  securityName: string,
  scopes: string[] = [],
): any {
  if (securityName === 'jwt') {
    /**
     * Define JWT where you want:
     * Request Header Authorization => request.headers.authorization
     * Request Body Token => request.body.token
     * Request Header x-access-token => request.headers['x-access-token']
     *
     * DOCU: https://tsoa-community.github.io/docs/authentication.html
     * DOCU JWT auth0 with issuer and audience : https://github.com/lukeautry/tsoa/issues/490
     */
    const token = request.headers.authorization || '';

    return new Promise((resolve, reject) => {
      if (!token) {
        reject(new Error('No token provided'));
      }
      jwt.verify(token, CONFIG.JWT.SECRET, (err: any, decoded: any) => {
        if (err) {
          reject(err);
        } else {
          // Check if JWT contains all required scopes if you need
          if (scopes.length > 0) {
            scopes.forEach(scope => {
              if (!decoded.scopes.includes(scope)) {
                reject(new Error('JWT does not contain required scope.'));
              }
            });
          }
          resolve(decoded);
        }
      });
    });
  }
}
