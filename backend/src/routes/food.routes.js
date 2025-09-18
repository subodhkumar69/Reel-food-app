const express = require("express")
const foodController = require("../controllers/food.controller")
const authMiddleware = require("../middlewares/auth.middleware")
const multer = require("multer")

const upload = multer({
    storage: multer.memoryStorage(),
})


const router = express.Router();

// POST ("/api/food/") [Protected] => we need middleware for it 
router.post("/", authMiddleware.authFoodPartnerMiddleware, upload.single("video") ,foodController.createFood)

// get ("/api/food")
router.get("/", authMiddleware.authUserMiddleware, foodController.getFoodItems )

router.post("/like", authMiddleware.authUserMiddleware, foodController.likeFood)

router.post("/save", authMiddleware.authUserMiddleware, foodController.saveFood)

router.get('/save',
    authMiddleware.authUserMiddleware,
    foodController.getSaveFood
)


module.exports = router;