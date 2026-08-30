import dotenv from "dotenv";
import mongoose from "mongoose";
import dns from "dns";
import connectDB from "./config/db.js";
import Category from "./models/CategoryModel.js";
import Product from "./models/ProductModel.js";
import User from "./models/UserModel.js";

// حل مشكلة الـ DNS للـ Atlas
dns.setServers(["8.8.8.8", "8.8.4.4"]);

dotenv.config();
await connectDB();

const categoriesData = [
  {
    name: "Proteins",
    slug: "proteins",
    description: "Whey protein isolate, blends, and plant proteins",
    image:
      "https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=600&auto=format&fit=crop&q=80",
  },
  {
    name: "Pre-Workout & Energy",
    slug: "pre-workout",
    description: "Formulas to boost focus, energy, and pump",
    image:
      "https://images.unsplash.com/photo-1546483875-ad9014c88eba?w=600&auto=format&fit=crop&q=80",
  },
  {
    name: "Creatine",
    slug: "creatine",
    description: "Micronized creatine monohydrate for strength",
    image:
      "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=600&auto=format&fit=crop&q=80",
  },
  {
    name: "Amino Acids & BCAAs",
    slug: "amino-acids",
    description: "Muscle recovery and hydration complexes",
    image:
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80",
  },
  {
    name: "Vitamins & Health",
    slug: "vitamins-health",
    description: "Omega-3, Multivitamins, Zinc, and Magnesium",
    image:
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80",
  },
];

const supplementProducts = [
  {
    name: "Optimum Nutrition Gold Standard 100% Whey 5 Lbs",
    brand: "Optimum Nutrition",
    price: 84.99,
    categorySlug: "proteins",
    countInStock: 25,
    rating: 4.9,
    numReviews: 48,
    image:
      "https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=600&auto=format&fit=crop&q=80",
    description:
      "The world's best-selling whey protein powder. Delivers 24g of pure whey protein per scoop with minimal fat and carbs.",
  },
  {
    name: "Dymatize ISO 100 Hydrolyzed Whey 5 Lbs",
    brand: "Dymatize",
    price: 94.99,
    categorySlug: "proteins",
    countInStock: 18,
    rating: 4.8,
    numReviews: 32,
    image:
      "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=600&auto=format&fit=crop&q=80",
    description:
      "Ultra-fast absorbing hydrolyzed 100% whey isolate, filtered to remove excess lactose, carbs, and fat.",
  },
  {
    name: "MuscleTech Nitro-Tech Ripped 4 Lbs",
    brand: "MuscleTech",
    price: 69.99,
    categorySlug: "proteins",
    countInStock: 14,
    rating: 4.6,
    numReviews: 19,
    image:
      "https://images.unsplash.com/photo-1546483875-ad9014c88eba?w=600&auto=format&fit=crop&q=80",
    description:
      "Advanced lean protein formula combined with CLA, L-Carnitine, and green tea extract for lean muscle definition.",
  },
  {
    name: "Cellucor C4 Original Pre-Workout 60 Servings",
    brand: "Cellucor",
    price: 44.99,
    categorySlug: "pre-workout",
    countInStock: 30,
    rating: 4.7,
    numReviews: 41,
    image:
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80",
    description:
      "Explosive energy and laser focus pre-workout formulated with CarnoSyn Beta-Alanine, Arginine, and 150mg caffeine.",
  },
  {
    name: "Ghost Legend Pre-Workout v2",
    brand: "Ghost",
    price: 49.99,
    categorySlug: "pre-workout",
    countInStock: 12,
    rating: 4.8,
    numReviews: 27,
    image:
      "https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=600&auto=format&fit=crop&q=80",
    description:
      "Premium pump, energy, and cognitive focus matrix with fully disclosed transparent label ingredients.",
  },
  {
    name: "Creapure 100% Micronized Creatine Monohydrate 500g",
    brand: "Creapure",
    price: 34.99,
    categorySlug: "creatine",
    countInStock: 50,
    rating: 5.0,
    numReviews: 65,
    image:
      "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=600&auto=format&fit=crop&q=80",
    description:
      "The purest grade micronized creatine monohydrate manufactured in Germany to maximize ATP production and power output.",
  },
  {
    name: "MuscleTech Platinum 100% Creatine 400g",
    brand: "MuscleTech",
    price: 27.99,
    categorySlug: "creatine",
    countInStock: 40,
    rating: 4.7,
    numReviews: 38,
    image:
      "https://images.unsplash.com/photo-1546483875-ad9014c88eba?w=600&auto=format&fit=crop&q=80",
    description:
      "Ultra-pure HPLC-tested micronized creatine powder that boosts strength, size, and muscle endurance.",
  },
  {
    name: "Scivation Xtend Original BCAA 90 Servings",
    brand: "Scivation",
    price: 42.99,
    categorySlug: "amino-acids",
    countInStock: 22,
    rating: 4.9,
    numReviews: 53,
    image:
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80",
    description:
      "Clinically proven 7g of 2:1:1 BCAAs with added electrolytes and Glutamine for ultimate workout recovery and hydration.",
  },
  {
    name: "Universal Nutrition Animal Pak Multivitamin 44 Packs",
    brand: "Universal Nutrition",
    price: 39.99,
    categorySlug: "vitamins-health",
    countInStock: 16,
    rating: 4.9,
    numReviews: 72,
    image:
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80",
    description:
      "The legendary foundational training pack packed with essential vitamins, minerals, antioxidants, and digestive enzymes.",
  },
  {
    name: "NOW Foods Ultra Omega-3 180 Softgels",
    brand: "NOW Foods",
    price: 24.99,
    categorySlug: "vitamins-health",
    countInStock: 35,
    rating: 4.8,
    numReviews: 29,
    image:
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80",
    description:
      "Molecularly distilled fish oil providing 500 EPA and 250 DHA per softgel for joint and cardiovascular health.",
  },
];

const importData = async () => {
  try {
    await Category.deleteMany();
    await Product.deleteMany();

    // 1. البحث عن مستخدم أدمن أو إنشاؤه تلقائياً
    let adminUser = await User.findOne({ isAdmin: true });

    if (!adminUser) {
      console.log("👤 Creating default admin user...");
      adminUser = await User.create({
        name: "Admin",
        email: "admin@example.com",
        password: "Password@1234",
        isAdmin: true,
        isEmailConfirmed: true,
      });
      console.log("✅ Admin user created: admin@example.com / Password@1234");
    }

    // 2. إدخال الأقسام
    const createdCategories = await Category.insertMany(categoriesData);
    console.log("✅ Categories imported successfully!");

    const categoryMap = {};
    createdCategories.forEach((cat) => {
      categoryMap[cat.slug] = cat._id;
    });

    // 3. إدخال المنتجات
    const finalProducts = supplementProducts.map((p) => {
      const { categorySlug, ...rest } = p;
      return {
        ...rest,
        user: adminUser._id,
        category: categoryMap[categorySlug],
      };
    });

    await Product.insertMany(finalProducts);
    console.log("✅ Products imported successfully!");

    process.exit();
  } catch (error) {
    console.error(`❌ Error importing data: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Category.deleteMany();
    await Product.deleteMany();
    console.log("🗑️ Data destroyed successfully!");
    process.exit();
  } catch (error) {
    console.error(`❌ Error destroying data: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}
