import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import Category from "./../models/CategoryModel.js";

export const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({});

  res.status(200).json({
    status: "success",
    results: categories.length,
    data: categories,
  });
});

export const getCategoryByIdOrSlug = asyncHandler(async (req, res) => {
  const { identifier } = req.params;

  const isObjectId = mongoose.Types.ObjectId.isValid(identifier);
  const query = isObjectId ? { _id: identifier } : { slug: identifier };

  const category = await Category.findOne(query);

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
  const categoryData = { ...req.body };

  if (req.file) {
    categoryData.image = req.file.path;
  }

  const category = await Category.create(categoryData);

  res.status(201).json({
    status: "success",
    data: category,
  });
});

export const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }

  category.name = req.body.name || category.name;
  category.description = req.body.description || category.description;

  if (req.file) {
    category.image = req.file.path;
  } else if (req.body.image) {
    category.image = req.body.image;
  }

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
