const express= require ("express");
const mongoose = require("mongoose");
const cors= require("cors");

const app= express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/mernDB")
.then(()=>{
  console.log("Mongodb connected");
}).catch((err)=>{
    console.log(err);
});

const ProductSchema= new mongoose.Schema({
    name: String,
    price:Number,
});

const Product= mongoose.model("Product",ProductSchema);

app.post("/products", async(req,res)=>{
    const product= await Product.create(req.body);
    res.json(product);
});

app.get("/products", async(req,res)=>{
    const products= await Product.find(req.body);
    res.json(products);
});

app.put("/products/:id", async(req,res)=>{
  try{
     const updateProduct= await Product.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new :true}
     );  
     
     res.json(updateProduct);
  }catch(err){
     console.log(err);
  }
});

app.delete("/products/:id",async(req,res)=>{
     try{
        await Product.findByIdAndDelete(req.params.id);

        res.json({
            message: "product Deleted"
        })
     }catch(err){
        console.log(err);
     }
})





app.listen(5000,()=>{
    console.log("server is running on port 5000");
});



