const bcrypt = require("bcryptjs");
const UserSchema = require("../schemas/user.schema");
const { generateToken } = require("../utils/jwt");

async function signUp(req, res) {
  try {
    const { fullName, phoneNumber, password, role } = req.body;

    // Check if user already exists
    const existingUser = await UserSchema.findOne({ phoneNumber });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "User with this phone number already exists" });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const user = new UserSchema({
      fullName,
      phoneNumber,
      password: hashedPassword,
      role: role || "user",
    });

    await user.save();

    // Generate token
    const token = generateToken({
      id: user._id,
      phoneNumber: user.phoneNumber,
      role: user.role,
    });

    // Remove password from response
    const userResponse = {
      id: user._id,
      fullName: user.fullName,
      phoneNumber: user.phoneNumber,
      role: user.role,
      isActive: user.isActive,
    };

    res.status(201).json({
      message: "User created successfully",
      user: userResponse,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function signIn(req, res) {
  try {
    const { phoneNumber, password } = req.body;

    // Find user
    const user = await UserSchema.findOne({ phoneNumber });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({ error: "Account is deactivated" });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate token
    const token = generateToken({
      id: user._id,
      phoneNumber: user.phoneNumber,
      role: user.role,
    });

    // Remove password from response
    const userResponse = {
      id: user._id,
      fullName: user.fullName,
      phoneNumber: user.phoneNumber,
      role: user.role,
      isActive: user.isActive,
    };

    res.status(200).json({
      message: "Login successful",
      user: userResponse,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function getProfile(req, res) {
  try {
    const user = await UserSchema.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  signUp,
  signIn,
  getProfile,
};
