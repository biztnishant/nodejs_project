const express=require("express");
const { createCategory, getCategories, getCategorybyId, deleteCategoryById }=require("../controllers/category");
const router=express.Router();
router.post("/createCategory",createCategory);
router.get("/getCategories",getCategories);
router.get("/getCategorybyId/:id", getCategorybyId);
router.delete("/deleteCategory/:id", deleteCategoryById);
export default router;