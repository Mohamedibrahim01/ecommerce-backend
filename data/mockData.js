export const users = [
  {
    name: "Admin User",
    email: "admin@example.com",
    password: "Admin@123456",
    confirmPassword: "Admin@123456",
    isAdmin: true,
    avatar: "/uploads/default-avatar.png",
  },
  {
    name: "Mohamed Ibrahim",
    email: "mohamed@example.com",
    password: "User@123456",
    confirmPassword: "User@123456",
    isAdmin: false,
    avatar: "/uploads/default-avatar.png",
  },
  {
    name: "Sara Ahmed",
    email: "sara@example.com",
    password: "User@123456",
    confirmPassword: "User@123456",
    isAdmin: false,
    avatar: "/uploads/default-avatar.png",
  },
  {
    name: "Omar Ali",
    email: "omar@example.com",
    password: "User@123456",
    confirmPassword: "User@123456",
    isAdmin: false,
    avatar: "/uploads/default-avatar.png",
  },
];
export const categories = [
  {
    name: "Proteins",
    description: "Whey, Casein, Isolate, and Plant-based protein powders.",
    image: "/uploads/category-proteins.png",
    isActive: true,
  },
  {
    name: "Creatine & Pre-Workout",
    description: "Boost performance, strength, and explosive energy.",
    image: "/uploads/category-creatine.png",
    isActive: true,
  },
  {
    name: "Vitamins & Minerals",
    description: "Essential micronutrients for recovery, health, and immunity.",
    image: "/uploads/category-vitamins.png",
    isActive: true,
  },
  {
    name: "Gym Accessories",
    description: "Lifting straps, shaker bottles, belts, and workout gear.",
    image: "/uploads/category-accessories.png",
    isActive: true,
  },
];

export const sampleProducts = [
  {
    name: "Gold Standard 100% Whey Protein (5 lbs)",
    image: "/uploads/whey-gold.png",
    description:
      "24g of high-quality whey protein isolate per serving to help build and maintain muscle mass.",
    brand: "Optimum Nutrition",
    categoryName: "Proteins",
    price: 89.99,
    countInStock: 25,
    rating: 4.8,
    numReviews: 3,
  },
  {
    name: "ISO 100 Hydrolyzed Whey Isolate (5 lbs)",
    image: "/uploads/iso-100.png",
    description:
      "Super-fast digesting and absorbing hydrolyzed whey protein isolate for lean muscle support.",
    brand: "Dymatize",
    categoryName: "Proteins",
    price: 94.99,
    countInStock: 18,
    rating: 4.9,
    numReviews: 2,
  },
  {
    name: "Creatine Monohydrate Micronized (300g)",
    image: "/uploads/creatine-on.png",
    description:
      "Pure micronized creatine monohydrate to support muscle power, strength, and size.",
    brand: "Optimum Nutrition",
    categoryName: "Creatine & Pre-Workout",
    price: 29.99,
    countInStock: 40,
    rating: 4.9,
    numReviews: 2,
  },
  {
    name: "C4 Original Pre-Workout (60 Servings)",
    image: "/uploads/c4-preworkout.png",
    description:
      "Explosive energy, heightened focus, and an overwhelming urge to tackle any workout challenge.",
    brand: "Cellucor",
    categoryName: "Creatine & Pre-Workout",
    price: 39.99,
    countInStock: 15,
    rating: 4.6,
    numReviews: 1,
  },
  {
    name: "Opti-Men Daily Multivitamin (150 Tablets)",
    image: "/uploads/opti-men.png",
    description:
      "Comprehensive nutrient optimization system providing 75+ active ingredients in 4 specific blends.",
    brand: "Optimum Nutrition",
    categoryName: "Vitamins & Minerals",
    price: 32.5,
    countInStock: 30,
    rating: 4.7,
    numReviews: 2,
  },
  {
    name: "Triple Strength Omega-3 Fish Oil (120 Softgels)",
    image: "/uploads/omega3.png",
    description:
      "High concentration of EPA and DHA fatty acids supporting cardiovascular and joint health.",
    brand: "Sports Research",
    categoryName: "Vitamins & Minerals",
    price: 26.99,
    countInStock: 50,
    rating: 4.8,
    numReviews: 1,
  },
  {
    name: "Figure 8 Weightlifting Straps",
    image: "/uploads/lifting-straps.png",
    description:
      "Heavy-duty cotton webbing deadlift straps designed for maximum grip security and wrist support.",
    brand: "GymReapers",
    categoryName: "Gym Accessories",
    price: 19.99,
    countInStock: 35,
    rating: 4.9,
    numReviews: 2,
  },
  {
    name: "Stainless Steel Shaker Bottle 700ml",
    image: "/uploads/shaker.png",
    description:
      "Insulated, odor-resistant stainless steel protein shaker bottle with leak-proof flip cap.",
    brand: "BlenderBottle",
    categoryName: "Gym Accessories",
    price: 24.99,
    countInStock: 20,
    rating: 4.5,
    numReviews: 1,
  },
];

export const sampleReviews = [
  {
    _id: "rev_1",
    user: {
      _id: "u_101",
      name: "أحمد علي",
      avatar:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    },
    productId: "prod_whey_gold",
    productName: "Gold Standard 100% Whey",
    rating: 5,
    comment:
      "أفضل بروتين جربته من ناحية سرعة الذوبان والطعم الخفيف، مبيعملش أي انتفاخات وممتاز بعد التمرين مباشرة.",
    createdAt: "2026-08-15T10:30:00.000Z",
  },
  {
    _id: "rev_2",
    user: {
      _id: "u_102",
      name: "عمر خالد",
      avatar:
        "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80",
    },
    productId: "prod_creatine_mono",
    productName: "Creatine Monohydrate 300g",
    rating: 5,
    comment:
      "كرياتين خام ميكرونايزد ممتاز وسعره مناسب جداً، فرق معايا بوضوح في زيادة القوة والأوزان بعد أسبوعين استخدام.",
    createdAt: "2026-08-20T14:15:00.000Z",
  },
  {
    _id: "rev_3",
    user: {
      _id: "u_103",
      name: "سارة محمود",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    },
    productId: "prod_iso_100",
    productName: "Dymatize ISO 100 Hydrolyzed",
    rating: 4,
    comment:
      "جودة بروتين عالية جداً وطعم الشوكولاتة لذيذ، النقطة الوحيدة إنه مسكّر شوية زيادة عن اللزوم بس خفيف جداً على المعدة.",
    createdAt: "2026-08-25T09:00:00.000Z",
  },
  {
    _id: "rev_4",
    user: {
      _id: "u_104",
      name: "يوسف حسن",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    },
    productId: "prod_c4_preworkout",
    productName: "Cellucor C4 Original Pre-Workout",
    rating: 4,
    comment:
      "بامب وتركيز ممتازين في التمرين بدون رعشة أو هبوط مفاجئ، نكهة الفواكه كويسة جداً.",
    createdAt: "2026-08-28T18:45:00.000Z",
  },
  {
    _id: "rev_5",
    user: {
      _id: "u_105",
      name: "كريم شريف",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    },
    productId: "prod_omega3_fishoil",
    productName: "Triple Strength Omega-3",
    rating: 5,
    comment:
      "كبسولات سهلة البلع ومفيش أي طعم سمك نهائي بعد الاستخدام، أساسي لصحة المفاصل والاستشفاء.",
    createdAt: "2026-09-01T11:20:00.000Z",
  },
];
