import { Schema, model, Document } from "mongoose";
import slugify from 'slugify';

export interface ICategory extends Document {
    name: string;
    slug: string;
    image: string
}

const CategorySchema = new Schema<ICategory>({
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    image: { type: String, required: true, },
});

CategorySchema.pre<ICategory>('save', function (next) {
    if (this.isModified('name')) {
        this.slug = slugify(this.name, { lower: true });
    }
    next();
});

export default model<ICategory>("Category", CategorySchema);
