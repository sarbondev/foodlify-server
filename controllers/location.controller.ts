import type { Request, Response } from "express"
import LocationSchema from "../schemas/location.schema"
import mongoose from "mongoose"

export async function createLocation(req: Request, res: Response) {
  try {
    const { name, coordinates, address } = req.body

    const location = new LocationSchema({ name, coordinates, address })
    await location.save()

    return res.status(201).json({
      message: "Location created successfully",
      location,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Internal server error" })
  }
}

export async function getAllLocations(req: Request, res: Response) {
  try {
    const { page = 1, limit = 10 } = req.query

    const locations = await LocationSchema.find()
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .sort({ createdAt: -1 })

    const total = await LocationSchema.countDocuments()

    return res.status(200).json({
      locations,
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

export async function getLocationById(req: Request, res: Response) {
  try {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid location ID" })
    }

    const location = await LocationSchema.findById(id)
    if (!location) {
      return res.status(404).json({ error: "Location not found" })
    }

    res.status(200).json({ location })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Internal server error" })
  }
}

export async function updateLocation(req: Request, res: Response) {
  try {
    const { id } = req.params
    const { name, coordinates, address } = req.body

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid location ID" })
    }

    const location = await LocationSchema.findByIdAndUpdate(
      id,
      { name, coordinates, address },
      { new: true, runValidators: true },
    )

    if (!location) {
      return res.status(404).json({ error: "Location not found" })
    }

    res.status(200).json({
      message: "Location updated successfully",
      location,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Internal server error" })
  }
}

export async function deleteLocation(req: Request, res: Response) {
  try {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid location ID" })
    }

    const location = await LocationSchema.findByIdAndDelete(id)
    if (!location) {
      return res.status(404).json({ error: "Location not found" })
    }

    res.status(200).json({ message: "Location deleted successfully" })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Internal server error" })
  }
}

export async function getNearbyLocations(req: Request, res: Response) {
  try {
    const { lat, lng, maxDistance = 10000 } = req.query // maxDistance in meters

    if (!lat || !lng) {
      return res.status(400).json({ error: "Latitude and longitude are required" })
    }

    const locations = await LocationSchema.find({
      coordinates: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [Number(lng), Number(lat)],
          },
          $maxDistance: Number(maxDistance),
        },
      },
    })

    res.status(200).json({ locations })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Internal server error" })
  }
}
