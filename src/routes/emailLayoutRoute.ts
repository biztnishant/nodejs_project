const express=require('express');
const { createEmailLayout, getEmailLayouts, deleteEmailLayout }=require('../controllers/emailLayout');
const router = express.Router();
router.post("/createEmailLayout", createEmailLayout);
router.get("/getEmailLayouts", getEmailLayouts);
router.delete("/deleteEmailLayout/:id", deleteEmailLayout);
export default router;