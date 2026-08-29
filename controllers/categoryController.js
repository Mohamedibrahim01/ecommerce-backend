import asyncHandler from "express-async-handler";
import Category from "./../models/CategoryModel.js";

export const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({});

  res.status(200).json({
    status: "success",
    results: categories.length,
    data: categories,
  });
});

export const getCategoryById = asyncHandler(async (req, res) => {
  const category = await Category.findOne({ slug: req.params.slug });

  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }

  res.status(200).json({
    status: "success",
    data: category,
  });
});

export const createCategory = asyncHandler(async (req, res) => {
  const category = await Category.create({ ...req.body });

  res.status(201).json({
    status: "success",
    data: category,
  });
});

export const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    res.status(404);
    throw new Error("Category not found!");
  }

  category.name = req.body.name || category.name;
  category.description = req.body.description || category.description;
  category.image = req.body.image || category.image;

  if (req.body.isActive !== undefined) {
    category.isActive = req.body.isActive;
  }

  const updatedCategory = await category.save();

  res.status(200).json({
    status: "success",
    data: updatedCategory,
  });
});

export const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndDelete(req.params.id);

  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }

  res.status(200).json({
    status: "success",
    message: "Category deleted successfully",
  });
});
