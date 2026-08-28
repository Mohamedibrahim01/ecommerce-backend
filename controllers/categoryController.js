import Category from "./../models/CategoryModel.js";

export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({});

    res.status(200).json({
      status: "success",
      results: categories.length,
      data: categories,
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};
export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });
    if (!category) {
      return res.status(404).json({
        status: "fail",
        message: "category not found",
      });
    }
    res.status(200).json({
      status: "success",
      data: category,
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};
export const createCategory = async (req, res) => {
  try {
    const category = await Category.create({
      ...req.body,
    });
    res.status(201).json({
      status: "success",
      data: category,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};
export const updateCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        status: "fail",
        message: "Category not found!",
      });
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
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({
        status: "fail",
        message: "category not found",
      });
    }
    res.status(200).json({
      status: "success",
      message: "category deleted successfylly",
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};
