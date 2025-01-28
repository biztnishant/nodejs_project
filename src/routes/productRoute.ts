const express = require('express');
const { createProduct, getAllProducts, updateProduct, deleteProduct, getProductById, groupProductsByCategory, getProductByCategories, getProductByCategory, searchProducts } = require('../controllers/product')
const router = express.Router();
import { uploadToDisk, uploadToMemory, } from "../middleware/upload";
import { validateProduct } from "../middleware/validateMiddleware";
import { productValidationSchema } from "../validationSchemas/productValidationSchema";
// router.post("/createProduct", validateProduct(productValidationSchema), uploadToDisk.single('image'),uploadToMemory.single('image'),createProduct);
router.post("/createProduct", validateProduct(productValidationSchema),uploadToDisk.single("image"),createProduct);
// router.post("/createProduct", validateProduct(productValidationSchema), uploadToMemory.single("bufferImage"), createProduct)
router.get("/getAll", getAllProducts);
router.put("/updateProduct/:id", updateProduct);
router.delete("/deleteProduct/:id", deleteProduct);
router.get("/getProductById/:id", getProductById);
router.get("/groupByCategory", groupProductsByCategory);
router.get("/getProductByCategories",getProductByCategories);
router.get("/getProductByCategory", getProductByCategory);
router.get("/searchProducts", searchProducts);
export default router;