const mongoose = require("mongoose");
const { translate } = require("@vitalets/google-translate-api");
const { Product } = require("../schemas/product.schema");
const {
  createProductSchema,
  updateProductSchema,
} = require("../validators/product.validator");

const createProduct = async (req, res) => {
  const validation = createProductSchema.validate(req.body);
  if (validation.error) {
    return res.status(400).json({ error: validation.error.message });
  }

  const {
    title,
    description,
    images,
    previewImage,
    priceCard,
    priceRegular,
    discount,
    category,
    weight,
    stock,
  } = req.body;

  try {
    const result = await translate(title, { to: "en" });
    if (!result?.from?.language?.iso) {
      return res.status(400).json({ error: "Tilni aniqlab bo'lmadi" });
    }
    const lang = result.from.language.iso;

    let title_uz = "";
    let title_ru = "";
    let description_uz = "";
    let description_ru = "";

    if (lang === "uz") {
      const [tRu, dRu] = await Promise.all([
        translate(title, { from: "uz", to: "ru" }),
        translate(description, { from: "uz", to: "ru" }),
      ]);
      title_uz = title;
      title_ru = tRu.text;
      description_uz = description;
      description_ru = dRu.text;
    } else if (lang === "ru") {
      const [tUz, dUz] = await Promise.all([
        translate(title, { from: "ru", to: "uz" }),
        translate(description, { from: "ru", to: "uz" }),
      ]);
      title_ru = title;
      title_uz = tUz.text;
      description_ru = description;
      description_uz = dUz.text;
    } else {
      return res
        .status(400)
        .json({ error: "Faqat uz yoki ru tilida matn kiriting" });
    }

    const product = new Product({
      images,
      previewImage,
      title_uz,
      title_ru,
      description_uz,
      description_ru,
      priceCard,
      priceRegular,
      discount,
      category,
      weight,
      stock,
    });

    await product.save();
    await product.populate("category");

    res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server xatosi" });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      minPrice,
      maxPrice,
      search,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const filter = {};

    if (category) filter.category = category;
    if (minPrice || maxPrice) {
      filter.priceCard = {};
      if (minPrice) filter.priceCard.$gte = Number(minPrice);
      if (maxPrice) filter.priceCard.$lte = Number(maxPrice);
    }
    if (search) {
      filter.$or = [
        { title_uz: { $regex: search, $options: "i" } },
        { title_ru: { $regex: search, $options: "i" } },
        { description_uz: { $regex: search, $options: "i" } },
        { description_ru: { $regex: search, $options: "i" } },
      ];
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;

    const products = await Product.find(filter)
      .populate("category")
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .sort(sortOptions);

    const total = await Product.countDocuments(filter);

    res.status(200).json({
      products,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Mahsulotlarni olishda xatolik" });
  }
};

const getProductById = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Noto'g'ri ID" });
  }

  try {
    const product = await Product.findById(id).populate("category");
    if (!product) return res.status(404).json({ error: "Topilmadi" });
    res.status(200).json({ product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Xatolik yuz berdi" });
  }
};

const updateProduct = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Noto'g'ri ID" });
  }

  const validation = updateProductSchema.validate(req.body);
  if (validation.error) {
    return res.status(400).json({ error: validation.error.message });
  }

  try {
    const updated = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    }).populate("category");

    if (!updated) return res.status(404).json({ error: "Topilmadi" });

    res.status(200).json({
      message: "Product updated successfully",
      product: updated,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Xatolik" });
  }
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Noto'g'ri ID" });
  }

  try {
    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: "Topilmadi" });
    res.status(200).json({ message: "Mahsulot o'chirildi" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server xatoligi" });
  }
};

const getProductsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({ error: "Invalid category ID" });
    }

    const products = await Product.find({ category: categoryId })
      .populate("category")
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .sort({ createdAt: -1 });

    const total = await Product.countDocuments({ category: categoryId });

    res.status(200).json({
      products,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

const updateProductStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { stock } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid product ID" });
    }

    const product = await Product.findByIdAndUpdate(
      id,
      { stock: Number(stock) },
      { new: true, runValidators: true }
    ).populate("category");

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json({
      message: "Stock updated successfully",
      product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
  updateProductStock,
};
