const { verifyToken } = require("../utils/jwt");
const UserSchema = require("../schemas/user.schema");

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
const authenticate = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res
        .status(401)
        .json({ error: "Access denied. No token provided." });
    }

    const decoded = verifyToken(token);
    const user = await UserSchema.findById(decoded.id);

    if (!user || !user.isActive) {
      return res.status(401).json({ error: "Invalid token or user inactive." });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token." });
  }
};

/**
 * @param {string[]} roles
 */
const authorize = (roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ error: "Access denied. Insufficient permissions." });
    }
    next();
  };
};

module.exports = {
  authenticate,
  authorize,
};
