import { Schema, model, Document, Types } from 'mongoose';

export interface IProduct extends Document {
    images: string[];
    previewImage: string;
    title_uz: string;
    title_ru: string;
    description_uz: string;
    description_ru: string;
    priceCard: number;
    priceRegular: number;
    discount: number;
    category: Types.ObjectId;
    weight: number;
    sold: number;
    stock: number;
}

const ProductSchema = new Schema<IProduct>(
    {
        images: [{ type: String }],
        previewImage: { type: String, required: true },
        title_uz: { type: String, required: true },
        title_ru: { type: String, required: true },
        description_uz: { type: String, required: true },
        description_ru: { type: String, required: true },
        priceCard: { type: Number, required: true },
        priceRegular: { type: Number, required: true },
        discount: { type: Number, default: 0 },
        category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
        weight: { type: Number, required: true },
        sold: { type: Number, default: 0 },
        stock: { type: Number, default: 0 },
    },
    { timestamps: true }
);

export const Product = model<IProduct>('Product', ProductSchema);
