const { Schema, model } = require('mongoose');

const ProductSchema = new Schema(
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

module.exports = model('Product', ProductSchema);
