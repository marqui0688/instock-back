/** @format */

const router = require("express").Router();
const inventoriesController = require("../controllers/inventoriesController");

router.route("/").get(inventoriesController.index);

router.route("/:inventoryId").get(inventoriesController.getSingleInventory);

router.route("/").post(inventoriesController.addInventory);

router.route("/:id").put(inventoriesController.updateInventory);


router.route("/:id").delete(inventoriesController.deleteInventory);

module.exports = router;
