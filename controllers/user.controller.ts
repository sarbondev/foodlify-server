import type { Request, Response } from "express"
import bcrypt from "bcryptjs"
import UserSchema from "../schemas/user.schema"
import mongoose from "mongoose"

export async function getAllUsers(req: Request, res: Response) {
    try {
        const { page = 1, limit = 10, role, isActive } = req.query
        const filter: any = {}

        if (role) filter.role = role
        if (isActive !== undefined) filter.isActive = isActive === "true"

        const users = await UserSchema.find(filter)
            .select("-password")
            .limit(Number(limit))
            .skip((Number(page) - 1) * Number(limit))
            .sort({ createdAt: -1 })

        const total = await UserSchema.countDocuments(filter)

        return res.status(200).json({
            users,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / Number(limit)),
            },
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Internal server error" })
    }
}

export async function getUserById(req: Request, res: Response) {
    try {
        const { id } = req.params

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid user ID" })
        }

        const user = await UserSchema.findById(id).select("-password")
        if (!user) {
            return res.status(404).json({ error: "User not found" })
        }

        res.status(200).json({ user })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Internal server error" })
    }
}

export async function updateUser(req: Request, res: Response) {
    try {
        const { id } = req.params
        const { fullName, phoneNumber, role, isActive, password } = req.body

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid user ID" })
        }

        const updateData: any = {}
        if (fullName) updateData.fullName = fullName
        if (phoneNumber) updateData.phoneNumber = phoneNumber
        if (role) updateData.role = role
        if (isActive !== undefined) updateData.isActive = isActive

        // Hash new password if provided
        if (password) {
            const saltRounds = 10
            updateData.password = await bcrypt.hash(password, saltRounds)
        }

        const user = await UserSchema.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).select(
            "-password",
        )

        if (!user) {
            return res.status(404).json({ error: "User not found" })
        }

        res.status(200).json({ message: "User updated successfully", user })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Internal server error" })
    }
}

export async function deleteUser(req: Request, res: Response) {
    try {
        const { id } = req.params

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid user ID" })
        }

        const user = await UserSchema.findByIdAndDelete(id)
        if (!user) {
            return res.status(404).json({ error: "User not found" })
        }

        res.status(200).json({ message: "User deleted successfully" })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Internal server error" })
    }
}

export async function toggleUserStatus(req: Request, res: Response) {
    try {
        const { id } = req.params

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid user ID" })
        }

        const user = await UserSchema.findById(id)
        if (!user) {
            return res.status(404).json({ error: "User not found" })
        }

        user.isActive = !user.isActive
        await user.save()

        res.status(200).json({
            message: `User ${user.isActive ? "activated" : "deactivated"} successfully`,
            user: {
                id: user._id,
                fullName: user.fullName,
                phoneNumber: user.phoneNumber,
                role: user.role,
                isActive: user.isActive,
            },
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Internal server error" })
    }
}
