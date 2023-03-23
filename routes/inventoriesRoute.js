const router = require("express").Router();
const inventoriesController = require("../controllers/inventoriesController");

router.route("/").get(inventoriesController.index);

// Note: The warehouse name must also be included in the response:
router.route("/:inventoryId").get(inventoriesController.getSingleInventory);

router.route("/").post(inventoriesController.addInventory);

module.exports = router;
