const foodModel = require("../models/food.model")
const storageService = require("../services/storage.service")
const {v4: uuid} = require("uuid")
const likeModel = require("../models/likes.model")
const saveModel = require("../models/save.model")

async function createFood(req, res) {

    // console.log(req.foodPartner)
    // console.log(req.file)
    // res.send("food item created")

    const fileUploadResult = await storageService.uploadFile(req.file.buffer, uuid() )

   const foodItem = await foodModel.create({
    name: req.body.name,
    description: req.body.description,
    video: fileUploadResult.url,
    foodPartner: req.foodPartner._id,

   })

   res.status(201).json({
    message: "Food item created successfully",
    food: foodItem,
   })

}

async function getFoodItems(req, res) {
    const foodItems = await foodModel.find({})

    res.status(200).json({
        message: "food items fetched successfully",
        foodItems
    })

}

async function likeFood(req, res) {
    try {
        const { foodId } = req.body;
        const user = req.user;

        if (!user || !user._id) {
            return res.status(401).json({ message: "Unauthorized: user not found" });
        }

        if (!foodId) {
            return res.status(400).json({ message: "Food ID is required" });
        }

        const isAlreadyLiked = await likeModel.findOne({
            user: user._id,
            food: foodId
        });
    if (isAlreadyLiked) {
    await likeModel.deleteOne({ user: user._id, food: foodId });
    await foodModel.findByIdAndUpdate(foodId, { $inc: { likeCount: -1 } });

    return res.status(200).json({
        message: "Food unliked successfully",
        liked: false
    });
   }

   const like = await likeModel.create({ user: user._id, food: foodId });
   await foodModel.findByIdAndUpdate(foodId, { $inc: { likeCount: 1 } });

   res.status(201).json({
    message: "Food liked successfully",
    liked: true
   });
    } catch (error) {
        console.error("Error in likeFood:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}


async function saveFood(req, res) {

    const { foodId } = req.body;
    const user = req.user;

    const isAlreadySaved = await saveModel.findOne({
        user: user._id,
        food: foodId
    })
     
    if (isAlreadySaved) {
    await saveModel.deleteOne({ user: user._id, food: foodId });
    await foodModel.findByIdAndUpdate(foodId, { $inc: { savesCount: -1 } });

    return res.status(200).json({
        message: "Food unsaved successfully",
        saved: false
    });
}

const save = await saveModel.create({ user: user._id, food: foodId });
await foodModel.findByIdAndUpdate(foodId, { $inc: { savesCount: 1 } });

res.status(201).json({
    message: "Food saved successfully",
    saved: true
});

}

async function getSaveFood(req, res) {

    const user = req.user;

    const savedFoods = await saveModel.find({ user: user._id }).populate('food');

    if (!savedFoods || savedFoods.length === 0) {
        return res.status(404).json({ message: "No saved foods found" });
    }

    res.status(200).json({
        message: "Saved foods retrieved successfully",
        savedFoods
    });

}




module.exports ={
    createFood,
    getFoodItems,
    likeFood,
    saveFood,
    getSaveFood
}