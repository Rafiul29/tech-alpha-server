// expernal import 
const express = require('express');

// internal import 
const {addProduct, getAllProducts,getSingleProduct}=require("../controllers/productController")

// router
const route=express.Router();


// add new product
route.post("/",addProduct)

// get all products
route.get("/",getAllProducts)

// get sigle product
route.get("/:id",getSingleProduct)


module.exports=route;