import mongoose from "mongoose";
import dotenv from "dotenv";
import slugify from "slugify";
import connectDB from "./config/db.js";

import User from "./models/UserModel.js";
import Category from "./models/CategoryModel.js";
import Product from "./models/ProductModel.js";
import Order from "./models/OrderModel.js";

import { users, categories, sampleProducts } from "./data/mockData.js";

dotenv.config();
await connectDB();

const importData = async () => {
  try {
    // 1. مسح البيانات القديمة
    await Order.deleteMany();
    await Product.deleteMany();
    await Category.deleteMany();
    await User.deleteMany();

    // 2. إدخال المستخدمين (User.create يشغل الـ pre-save hook والـ validators تلقائياً)
    const createdUsers = await User.create(users);
    const adminUser = createdUsers[0]._id;

    // خريطة المستخدمين لربط التقييمات لو موجودة
    const userMap = {};
    createdUsers.forEach((u) => {
      userMap[u.name] = u._id;
    });

    // 3. توليد الـ slugs وإدخال الأقسام
    const categoriesWithSlug = categories.map((cat) => ({
      ...cat,
      slug: cat.slug || slugify(cat.name, { lower: true }),
    }));

    const createdCategories = await Category.insertMany(categoriesWithSlug);
    const categoryMap = {};
    createdCategories.forEach((cat) => {
      categoryMap[cat.name] = cat._id;
    });

    // 4. تجهيز وربط المنتجات بالأدمن، الكاتيجوري، والتقييمات
    const formattedProducts = sampleProducts.map((product) => {
      const formattedReviews = (product.reviews || []).map((r) => ({
        ...r,
        user: userMap[r.name] || adminUser,
      }));

      return {
        ...product,
        user: adminUser,
        category: categoryMap[product.categoryName],
        reviews: formattedReviews,
      };
    });

    await Product.insertMany(formattedProducts);

    console.log("Data Imported Successfully!");
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await Category.deleteMany();
    await User.deleteMany();

    console.log("Data Destroyed Successfully!");
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}
