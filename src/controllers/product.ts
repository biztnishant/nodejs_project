import { Request, Response,NextFunction } from "express";
import ProductModel from "../models/product";
import { AppError } from "../middleware/errorhandler";
import CategoryModel from "../models/category";
import { successHanlder } from "../middleware/successHandler";
// Create Product
// export const createProduct = async (req: Request, res: Response) => {
//   try {
//     const productData = await ProductModel.create(req.body);
//     res.status(201).json({ message: "Product created successfully", data: productData });
//   } catch (error: any) {
//     res.status(400).json({ message: "Error creating product", error: error.message });
//   }
// };

// // Get All Products
// export const getAllProducts = async (req: Request, res: Response) => {
//   try {
//     const products = await ProductModel.find();
//     res.status(200).json({ message: "Products fetched successfully", data: products });
//   } catch (error: any) {
//     res.status(404).json({ message: "Error fetching products", error: error.message });
//   }
// };

// // Update Product by ID
// export const updateProduct = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//     const productData = req.body;

//     const updatedProduct = await ProductModel.findByIdAndUpdate(id, productData, { new: true });
//     if (!updatedProduct) {
//       return res.status(404).json({ message: "Product not found" });
//     }

//     res.status(200).json({ message: "Product updated successfully", data: updatedProduct });
//   } catch (error: any) {
//     res.status(400).json({ message: "Error updating product", error: error.message });
//   }
// };

// // Delete Product by ID
// export const deleteProduct = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;

//     const deletedProduct = await ProductModel.findByIdAndDelete(id);
//     if (!deletedProduct) {
//       return res.status(404).json({ message: "Product not found" });
//     }

//     res.status(200).json({ message: "Product deleted successfully", data: deletedProduct });
//   } catch (error: any) {
//     res.status(400).json({ message: "Error deleting product", error: error.message });
//   }
// };


// Create Product
export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try{
    console.log("Request body:", req.body);
    // const{name,description,price,isActive,quantity,category , manufacturingAddress}=req.body;
   
    const image=req.file?.filename;
    // const bufferImage=req.file?.buffer;
    // console.log(req.file);
    // if (!imageBuffer) {
    //   console.log(imageBuffer);
    //   return next(new AppError("No image uploaded", 400)); // If no file uploaded, return error
    // }
    const productData=await ProductModel.create({
      // name,
      // description,
      // price,
      // isActive,
      // quantity,
      // category,
      // manufacturingAddress,
      image,
      ...req.body,//using spread operator here
      // bufferImage,
    });
    // res.status(201).json({message:"Product successfully created",data:productData});
   successHanlder(res,"Product created successfully",productData,201);
  }catch(error:any){
    next(error);
  }
};
// Get All Products
export const getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await ProductModel.find();
    if (!products.length) {
      throw new AppError("No products found", 404);
    }
    // res.status(200).json({ message: "Products fetched successfully", data: products });
    successHanlder(res,"Products fetched successfully",products);
  } catch (error: any) {
    next(error);
  }
};
// Update Product by ID
export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { name, description, price, isActive, quantity, category, manufacturingAddress } = req.body; 

    const updatedProduct = await ProductModel.findByIdAndUpdate(id,{
        name,
        description,
        price,
        isActive,
        quantity,
        category,
        manufacturingAddress
    },
    {new:true}
  );
    if (!updatedProduct) {
      throw new AppError("Product not found", 404);
    }
    // res.status(200).json({ message: "Product updated successfully", data: updatedProduct });
    successHanlder(res,"Product updated successfully",updatedProduct);
  } catch (error: any) {
    next(error);
  }
};
// Delete Product by ID
export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const deletedProduct = await ProductModel.findByIdAndDelete(id);
    if (!deletedProduct) {
      throw new AppError("Product not found", 404);
    }
    // res.status(200).json({ message: "Product deleted successfully", data: deletedProduct });
    successHanlder(res,"Product deleted successfully",deletedProduct);
  } catch (error: any) {
    next(error);
  }
};
export const getProductById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const product = await ProductModel.findById(id);
    if (!product) {
      throw new AppError("Product not found", 404);
    }
    res.status(200).json({ message: "Product fetched successfully", data: product });
  } catch (error:any) {
    next(error);
  }
};
// using groupBy Aggregate 
export const groupProductsByCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const groupedProducts = await ProductModel.aggregate([
      {
        $group: {
          _id: "$category", // group by the category field
          totalQuantity: { $sum: "$quantity" }, // calculate total quantity
          averagePrice: { $avg: "$price" }, // calculate average price
          products: { $push: "$name" }, // include product names in an array
        },
      },
      {
        $sort: { totalQuantity: -1 }, //  (descending)
      },
    ]);
    // res.status(200).json({
    //   message: "Products grouped by category",
    //   data: groupedProducts,
    // });
    successHanlder(res,"Products grouped by category",groupedProducts);
  } catch (error) {
    next(error);
  }
};
//using $lookup
export const getProductByCategories=async(req:Request,res:Response,next:NextFunction)=>{
  try{
    const productbyCategory=await ProductModel.aggregate([
      {
        $lookup:{
          from:"categories",
          localField:"category",
          foreignField:"_id",
          as:"categoryDetails"
        },
      },
     {
       $unwind:"$categoryDetails",
     },
    ]);
    if(productbyCategory.length===0){
      throw new AppError("There is not products by category",404);
    }
      // res.status(200).json({message:"Data fetched successfully",data:productbyCategory});
      successHanlder(res,"Fetched products by category successfully",productbyCategory);
  }catch(error:any){
    next(error);
  }
};
// Use promise.all to fetch productsByCategory
export const getProductByCategory=async(req:Request,res:Response,next:NextFunction)=>{
  try{
    const categories = await CategoryModel.find();
    if (!categories || categories.length === 0) {
      throw new AppError("Categories not found", 400);
    }
    const categoryPromise = categories.map((category) => {
      return ProductModel.find({ category: category._id }).then((products) => ({
        category: category.name,
        products,
      }));
    });
    const productByCategory = await Promise.all(categoryPromise)
    // res.status(200).json({message:"successfully fetched ",data:productByCategory});
    successHanlder(res,"Successfully fetched",productByCategory);
  }catch(error:any){
    next(error);
  }
};
export const searchProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    //query is used for search the given parameter values  
    const { name ,price} = req.query;
    const query:any={};
   // $regex operator to perform a regular expression search on the name field of a document.
    if (name) query.name = { $regex: name, $options: "i" }; // Case-insensitive
    if(price) query.price = {$gt:100};
    console.log("hh",query);
    const products = await ProductModel.find(query);
    // res.status(200).json({ data: products });
    successHanlder(res,`Get product with specific ${name} and ${price}`,products);
  } catch (error) {
    next(error);
  }
};

