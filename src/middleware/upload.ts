import multer, { FileFilterCallback, } from "multer";
import { Request } from "express";

// Define allowed  file types
const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];

// File filter for validating file type
const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Only .jpeg, .jpg, and .png formats are allowed"));
    }
};
// Disk storage configuration
const diskStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Save files to "uploads" folder
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Add timestamp to filename
    },
});
// Multer instance for disk storage
export const uploadToDisk = multer({
    storage: diskStorage,
    limits: { fileSize: 2 * 1024 * 1024 }, // Limit file size to 2MB
    fileFilter,
});
 //configuration for memory storage
const memoryStorage = multer.memoryStorage();

 //multer instance for memory storage
export const uploadToMemory=multer({
    storage:memoryStorage,
    limits:{fileSize:2*1024*1024},
    fileFilter,
});

