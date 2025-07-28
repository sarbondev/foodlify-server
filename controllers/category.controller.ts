import type { Request, Response } from "express"
import CategorySchema from "../schemas/category.schema"
import mongoose from "mongoose"

export async function createCategory(req: Request, res: Response) {
    try {
        const { name, image } = req.body

        const category = new CategorySchema({ name, image })
        await category.save()

        return res.status(201).json({
            message: "Category created successfully",
            category,
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Internal server error" })
    }
}

export async function getAllCategories(req: Request, res: Response) {
    try {
        const { page = 1, limit = 10 } = req.query

        const categories = await CategorySchema.find()
            .limit(Number(limit))
            .skip((Number(page) - 1) * Number(limit))
            .sort({ createdAt: -1 })

        const total = await CategorySchema.countDocuments()

        return res.status(200).json({
            categories,
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

export async function getCategoryById(req: Request, res: Response) {
    try {
        const { id } = req.params

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid category ID" })
        }

        const category = await CategorySchema.findById(id)
        if (!category) {
            return res.status(404).json({ error: "Category not found" })
        }

        res.status(200).json({ category })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Internal server error" })
    }
}

export async function getCategoryBySlug(req: Request, res: Response) {
    try {
        const { slug } = req.params

        const category = await CategorySchema.findOne({ slug })
        if (!category) {
            return res.status(404).json({ error: "Category not found" })
        }

        res.status(200).json({ category })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Internal server error" })
    }
}

export async function updateCategory(req: Request, res: Response) {
    try {
        const { id } = req.params
        const { name, image } = req.body

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid category ID" })
        }

        const category = await CategorySchema.findByIdAndUpdate(id, { name, image }, { new: true, runValidators: true })

        if (!category) {
            return res.status(404).json({ error: "Category not found" })
        }

        res.status(200).json({
            message: "Category updated successfully",
            category,
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Internal server error" })
    }
}

export async function deleteCategory(req: Request, res: Response) {
    try {
        const { id } = req.params

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid category ID" })
        }

        const category = await CategorySchema.findByIdAndDelete(id)
        if (!category) {
            return res.status(404).json({ error: "Category not found" })
        }

        res.status(200).json({ message: "Category deleted successfully" })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Internal server error" })
    }
}
