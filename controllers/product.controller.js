const mongoose = require("mongoose");
const { translate } = require("@vitalets/google-translate-api");
const Product = require("../schemas/product.schema");
const {
  createProductSchema,
  updateProductSchema,
} = require("../validators/product.validator");

// Tarjima funksiyasi - xatoliklarni yaxshi boshqaradi
const translateWithFallback = async (
  text,
  fromLang,
  toLang,
  maxRetries = 3
) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await translate(text, { from: fromLang, to: toLang });
      return result.text;
    } catch (error) {
      console.error(`Translation attempt ${attempt} failed:`, error.message);

      if (attempt === maxRetries) {
        // Agar barcha urinishlar muvaffaqiyatsiz bo'lsa, asl matnni qaytarish
        console.warn(
          `Translation failed after ${maxRetries} attempts, using original text`
        );
        return text;
      }

      // Keyingi urinishdan oldin kutish
      await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
    }
  }
};

// Tilni aniqlash funksiyasi
const detectLanguageImproved = async (text) => {
  try {
    const result = await translate(text, { to: "en" });

    if (!result?.from?.language?.iso) {
      // Agar til aniqlanmasa, matn asosida taxmin qilish
      const cyrillicPattern = /[\u0400-\u04FF]/;
      const uzbekPattern = /[oʻgʼhqxjʼ]/i;

      if (cyrillicPattern.test(text)) {
        return "ru";
      } else if (uzbekPattern.test(text)) {
        return "uz";
      } else {
        return null;
      }
    }

    return result.from.language.iso;
  } catch (error) {
    console.error("Language detection failed:", error.message);
    return null;
  }
};

// Parallel tarjima funksiyasi
const translateTexts = async (texts, fromLang, toLang) => {
  try {
    const promises = texts.map((text) =>
      translateWithFallback(text, fromLang, toLang)
    );
    return await Promise.all(promises);
  } catch (error) {
    console.error("Parallel translation failed:", error.message);
    // Agar parallel tarjima ishlamasa, asl matnlarni qaytarish
    return texts;
  }
};

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
    // Tilni aniqlash
    const detectedLang = await detectLanguageImproved(title);

    if (!detectedLang) {
      return res.status(400).json({
        error:
          "Tilni aniqlab bo'lmadi. Iltimos, o'zbek yoki rus tilida yozing.",
      });
    }

    if (!["uz", "ru"].includes(detectedLang)) {
      return res.status(400).json({
        error: "Faqat o'zbek yoki rus tilida matn kiriting",
      });
    }

    let title_uz = "";
    let title_ru = "";
    let description_uz = "";
    let description_ru = "";

    if (detectedLang === "uz") {
      title_uz = title;
      description_uz = description;

      // Rus tiliga tarjima qilish
      const [translatedTitle, translatedDescription] = await translateTexts(
        [title, description],
        "uz",
        "ru"
      );

      title_ru = translatedTitle;
      description_ru = translatedDescription;
    } else if (detectedLang === "ru") {
      title_ru = title;
      description_ru = description;

      // O'zbek tiliga tarjima qilish
      const [translatedTitle, translatedDescription] = await translateTexts(
        [title, description],
        "ru",
        "uz"
      );

      title_uz = translatedTitle;
      description_uz = translatedDescription;
    }

    // Mahsulotni yaratish
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
      message: "Mahsulot muvaffaqiyatli yaratildi",
      product,
      translationInfo: {
        detectedLanguage: detectedLang,
        translationStatus: "success",
      },
    });
  } catch (error) {
    console.error("Product creation error:", error);

    // Agar tarjima xatosi bo'lsa, asl matn bilan saqlashga harakat qilish
    if (error.message.includes("translate")) {
      try {
        const product = new Product({
          images,
          previewImage,
          title_uz: title,
          title_ru: title,
          description_uz: description,
          description_ru: description,
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
          message: "Mahsulot yaratildi (tarjimasiz)",
          product,
          warning: "Tarjima xizmati ishlamadi, asl matn saqlandi",
        });
      } catch (saveError) {
        res.status(500).json({ error: "Mahsulotni saqlashda xatolik" });
      }
    } else {
      res.status(500).json({ error: "Server xatosi" });
    }
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
      lang = "uz", // Til parametri qo'shildi
    } = req.query;

    const filter = {};

    if (category) filter.category = category;

    if (minPrice || maxPrice) {
      filter.priceCard = {};
      if (minPrice) filter.priceCard.$gte = Number(minPrice);
      if (maxPrice) filter.priceCard.$lte = Number(maxPrice);
    }

    if (search) {
      // Tanlangan tilga qarab qidirish
      const searchFields =
        lang === "uz"
          ? [
              { title_uz: { $regex: search, $options: "i" } },
              { description_uz: { $regex: search, $options: "i" } },
            ]
          : [
              { title_ru: { $regex: search, $options: "i" } },
              { description_ru: { $regex: search, $options: "i" } },
            ];

      filter.$or = searchFields;
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
      language: lang,
    });
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({ error: "Mahsulotlarni olishda xatolik" });
  }
};

const getProductById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Noto'g'ri ID formati" });
  }

  try {
    const product = await Product.findById(id).populate("category");

    if (!product) {
      return res.status(404).json({ error: "Mahsulot topilmadi" });
    }

    res.status(200).json({ product });
  } catch (error) {
    console.error("Get product by ID error:", error);
    res.status(500).json({ error: "Mahsulotni olishda xatolik" });
  }
};

const updateProduct = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Noto'g'ri ID formati" });
  }

  const validation = updateProductSchema.validate(req.body);
  if (validation.error) {
    return res.status(400).json({ error: validation.error.message });
  }

  try {
    // Agar title yoki description yangilanayotgan bo'lsa, tarjima qilish
    if (req.body.title || req.body.description) {
      const currentProduct = await Product.findById(id);
      if (!currentProduct) {
        return res.status(404).json({ error: "Mahsulot topilmadi" });
      }

      const title = req.body.title || currentProduct.title_uz;
      const description = req.body.description || currentProduct.description_uz;

      try {
        const detectedLang = await detectLanguageImproved(title);

        if (detectedLang && ["uz", "ru"].includes(detectedLang)) {
          if (detectedLang === "uz") {
            const [title_ru, description_ru] = await translateTexts(
              [title, description],
              "uz",
              "ru"
            );
            req.body.title_uz = title;
            req.body.title_ru = title_ru;
            req.body.description_uz = description;
            req.body.description_ru = description_ru;
          } else {
            const [title_uz, description_uz] = await translateTexts(
              [title, description],
              "ru",
              "uz"
            );
            req.body.title_ru = title;
            req.body.title_uz = title_uz;
            req.body.description_ru = description;
            req.body.description_uz = description_uz;
          }
        }
      } catch (translationError) {
        console.warn(
          "Translation failed during update, keeping original values"
        );
      }
    }

    const updated = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    }).populate("category");

    if (!updated) {
      return res.status(404).json({ error: "Mahsulot topilmadi" });
    }

    res.status(200).json({
      message: "Mahsulot muvaffaqiyatli yangilandi",
      product: updated,
    });
  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).json({ error: "Mahsulotni yangilashda xatolik" });
  }
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Noto'g'ri ID formati" });
  }

  try {
    const deleted = await Product.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ error: "Mahsulot topilmadi" });
    }

    res.status(200).json({
      message: "Mahsulot muvaffaqiyatli o'chirildi",
      deletedProduct: {
        id: deleted._id,
        title_uz: deleted.title_uz,
        title_ru: deleted.title_ru,
      },
    });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({ error: "Mahsulotni o'chirishda xatolik" });
  }
};

const getProductsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { page = 1, limit = 10, lang = "uz" } = req.query;

    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({ error: "Noto'g'ri kategoriya ID" });
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
      language: lang,
    });
  } catch (error) {
    console.error("Get products by category error:", error);
    res
      .status(500)
      .json({ error: "Kategoriya bo'yicha mahsulotlarni olishda xatolik" });
  }
};

const updateProductStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { stock } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Noto'g'ri mahsulot ID" });
    }

    if (stock < 0) {
      return res
        .status(400)
        .json({ error: "Stok miqdori manfiy bo'lishi mumkin emas" });
    }

    const product = await Product.findByIdAndUpdate(
      id,
      { stock: Number(stock) },
      { new: true, runValidators: true }
    ).populate("category");

    if (!product) {
      return res.status(404).json({ error: "Mahsulot topilmadi" });
    }

    res.status(200).json({
      message: "Stok muvaffaqiyatli yangilandi",
      product,
    });
  } catch (error) {
    console.error("Update stock error:", error);
    res.status(500).json({ error: "Stokni yangilashda xatolik" });
  }
};

// Tarjima holatini tekshirish funksiyasi
const checkTranslationHealth = async (req, res) => {
  try {
    const testText = "test";
    const result = await translateWithFallback(testText, "uz", "ru", 1);

    res.status(200).json({
      status: "healthy",
      message: "Tarjima xizmati ishlayapti",
      testResult: result,
    });
  } catch (error) {
    res.status(503).json({
      status: "unhealthy",
      message: "Tarjima xizmati ishlamayapti",
      error: error.message,
    });
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
  checkTranslationHealth, // Yangi funksiya
};
