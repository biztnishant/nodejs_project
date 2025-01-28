const express=require('express');
const { createEmailLayout, getEmailLayouts }=require('../controllers/emailLayout');
const router = express.Router();
router.post("/createEmailLayout", createEmailLayout);
router.get("/getEmailLayouts", getEmailLayouts)
export default router;