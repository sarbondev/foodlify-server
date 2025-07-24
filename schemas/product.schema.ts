import { Schema, model, Document, Types } from 'mongoose';

export interface IProduct extends Document {
    images: string[];
    previewImage: string;
    title: string;
    description: string;
    price: number;
    discount: number;
    category: Types.ObjectId;
    weight: number;
    sold: number;
    stock: number
}

const ProductSchema = new Schema<IProduct>({
    images: [String],
    previewImage: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    weight: { type: Number, required: true },
    sold: { type: Number, default: 0, },
    stock: { type: Number, default: 0 }
}, { timestamps: true });

export default model<IProduct>('Product', ProductSchema);
