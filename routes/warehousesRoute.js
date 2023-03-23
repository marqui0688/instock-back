const router = require("express").Router();
const warehousesController = require("../controllers/warehousesController");

router.route("/").get(warehousesController.index);

router.route("/").post(warehousesController.addWarehouse);

router.route('/:id').get(warehousesController.getSingleWarehouse)

router.route("/:id").put(warehousesController.updateWarehouse)


module.exports = router;
