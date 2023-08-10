// external import
const Product=require('../model/productModel')

// add a new product
const addProduct=async(req,res)=>{
    try{
        const product=await Product.create({...req.body});
        res.status(200).json(product)
    }catch(error){
      res.status(500).json({
        error:error.message
      })
    }
}

// get all products
const getAllProducts=async(req,res)=>{
  try{
    const products=await Product.find({}).sort({ createdAt: -1 });
    res.status(200).json(products)
  }catch(error){
    res.status(500).json({
      error:error.message
    })
  }
}

module.exports={
  addProduct,
  getAllProducts
}