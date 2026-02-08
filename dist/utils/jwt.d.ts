export declare class JwtUtils {
    static generateToken(payload: object): string;
    static verifyToken(token: string): any;
}
