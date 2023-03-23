const router = require("express").Router();
const warehousesController = require("../controllers/warehousesController");

router.route("/").get(warehousesController.index);

router.route("/").post(warehousesController.addWarehouse);

// GET /api/warehouses/:id/inventories
router
  .route("/:warehouseId/inventories")
  .get(warehousesController.allInventoriesforWarehouse);

router.route('/:id').get(warehousesController.getSingleWarehouse);


module.exports = router;
