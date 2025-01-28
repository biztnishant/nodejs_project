const express=require("express");
const { createCategory, getCategories, getCategorybyId }=require("../controllers/category");
const router=express.Router();
router.post("/createCategory",createCategory);
router.get("/getCategories",getCategories);
router.get("/getCategorybyId/:id", getCategorybyId);
export default router;