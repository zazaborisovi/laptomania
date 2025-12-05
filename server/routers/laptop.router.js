const express = require("express");
const { addLaptop, getLaptops, getLaptop, deleteLaptop, updateLaptop } = require("../controllers/laptop.controller");
const upload = require("../config/multer");
const protect = require("../middlewares/auth.middleware");
const allowedTo = require("../middlewares/roles.middleware");

const laptopRouter = express.Router();


laptopRouter.route("/")
    .post(protect, allowedTo('admin', 'moderator'), upload.array('images', 4), addLaptop)
    .get(getLaptops);

laptopRouter.route('/:id')
    .get(getLaptop)
    .delete(protect, allowedTo('admin', 'moderator'), deleteLaptop)
    .patch(protect, allowedTo('admin', 'moderator'), upload.array('images', 4), updateLaptop);
    // .patch(upload.array('images', 4), updateLaptop);


module.exports = laptopRouter;