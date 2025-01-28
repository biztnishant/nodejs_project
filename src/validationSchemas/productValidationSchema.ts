import Joi from 'joi';

// Define the Joi validation schema for the product
export const productValidationSchema = Joi.object({
    name: Joi.string().min(3).max(100).optional(),
    description: Joi.string().min(10).max(500).optional(),
    price: Joi.number().positive().optional(),
    isActive: Joi.boolean().optional(),
    quantity: Joi.number().integer().positive().optional(),
    category: Joi.string().optional(),
    image: Joi.array().items(Joi.string().uri()).optional(), // Validate image array (optional)
    imageBuffer: Joi.array().items(Joi.binary()).optional(),   
    manufacturingAddress: Joi.array().items(
        Joi.object({
            street: Joi.string().optional(),
            city: Joi.string().optional(),
            state: Joi.string().optional(),
            pincode: Joi.number().integer().positive().optional(),
        })
    ).optional()
});
