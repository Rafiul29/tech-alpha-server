const express = require('express');
const dotenv=require("dotenv");
const mongoose=require("mongoose");
const cors=require("cors");

// internal import
const productRoutes=require("./routes/productRoutes")

const app = express();

// dot env endables
dotenv.config();

// middlewares
app.use(express.json());
app.use(cors());



// bypass api
app.use("/product",productRoutes);

// database configuration
mongoose.connect(process.env.MONGODB_URI,{useNewUrlParser: true})
.then(()=>{
  console.log("connected to database");
})
.catch((err)=>{
  console.log(err);
});


//listen server
app.listen(4000, (req, res) => {
    console.log("server is running on port 4000");
});