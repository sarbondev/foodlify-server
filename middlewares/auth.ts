import type { Request, Response, NextFunction } from "express"
import { verifyToken } from "../utils/jwt"
import UserSchema from "../schemas/user.schema"

interface AuthRequest extends Request {
    user?: any
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "")

        if (!token) {
            return res.status(401).json({ error: "Access denied. No token provided." })
        }

        const decoded = verifyToken(token)
        const user = await UserSchema.findById(decoded.id)

        if (!user || !user.isActive) {
            return res.status(401).json({ error: "Invalid token or user inactive." })
        }

        req.user = user
        next()
    } catch (error) {
        res.status(401).json({ error: "Invalid token." })
    }
}

export const authorize = (roles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ error: "Access denied. Insufficient permissions." })
        }
        next()
    }
}
