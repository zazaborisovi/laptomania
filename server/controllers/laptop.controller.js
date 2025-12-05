// Models
const Laptop = require("../models/laptop.model");

// Utils
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const {imageUpload, deleteImage} = require("../utils/image");


// Add a new laptop
const addLaptop = catchAsync(async (req, res) => {
    const body = req.body;
    // Handle image uploads, create array of image paths of locals
    const images = req.files.map(file => file.path);

    // Sending request to upload images on cloudinary
    const result = await imageUpload('laptops', images);

    // Creating array of uploaded image public/secure URLS
    const imageUrls = result.map(img => ({url: img.secure_url, public_id: img.public_id}));

    // Assigning image URLs to body before saving to DB
    body.images = imageUrls;

    const newLaptop = await Laptop.create(body);

    res.status(201).json(newLaptop);
});

// Get all laptops
const getLaptops = catchAsync(async (req, res) => {
    const laptops = await Laptop.find();
    res.status(200).json(laptops);
});

// Get laptop by ID
const getLaptop = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const laptop = await Laptop.findById(id);

    if (!laptop) {
        return next(new AppError('Laptop not found', 404));
    }

    res.status(200).json(laptop);
});

// Delete laptop by ID
const deleteLaptop = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const laptop = await Laptop.findByIdAndDelete(id);

    const promises = laptop.images.map(img => deleteImage(img.public_id));
    const result = await Promise.all(promises);

    console.log(result);

    if (!laptop) {
        return next(new AppError('Laptop not found to delete', 404));
    }

    res.status(204).json();
});

// Update laptop by ID (optional, not in router)
const updateLaptop = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const updateLaptop = await Laptop.findByIdAndUpdate(id, req.body, { new: true });

    console.log(req.file, req.files)

    if(!updateLaptop) {
        return next(new AppError('laptop not found to update', 404));
    }

    res.status(200).json(updateLaptop);
});

module.exports = { addLaptop, getLaptops, getLaptop, deleteLaptop, updateLaptop };