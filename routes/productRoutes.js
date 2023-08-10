// expernal import 
const express = require('express');

// internal import 
const {addProduct, getAllProducts}=require("../controllers/productController")

// router
const route=express.Router();

// add new product
route.post("/",addProduct)

// get all products
route.post("/",getAllProducts)

module.exports=route;