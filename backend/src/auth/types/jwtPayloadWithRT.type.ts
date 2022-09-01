import { JwtPayload } from './jwtPayload.type';

export type JwtPayloadWithRT = JwtPayload & { refreshToken: string };
