// external import
const Product = require("../model/productModel");
const mongoose=require("mongoose")

// add a new product
const addProduct = async (req, res) => {
  try {
    const product = await Product.create({ ...req.body });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// get all products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// get a single product
const getSingleProduct = async (req, res) => {
  const { id } = req.params;
  try {

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: "invalid id" });
    }

    const singleProduct = await Product.findById(id);

    if (!singleProduct) {
      return res.status(404).json({ error: "No product found" });
    }
    
    res.status(200).json(singleProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  addProduct,
  getAllProducts,
  getSingleProduct,
};
