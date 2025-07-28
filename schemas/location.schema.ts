import { Schema, model, Document } from "mongoose";

export interface ICoordinates extends Document {
    lat: number
    lng: number
}

export interface ILocation extends Document {
    name: string;
    coordinates: ICoordinates
    address: string;
}

const CoordinatesSchema = new Schema<ICoordinates>({
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
})

const LocationSchema = new Schema<ILocation>({
    name: { type: String, required: true },
    coordinates: CoordinatesSchema
})

export default model<ILocation>("Location", LocationSchema)