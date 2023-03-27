const router = require("express").Router();
const warehousesController = require("../controllers/warehousesController");

router
  .route("/")
  .get(warehousesController.index)
  .post(warehousesController.addWarehouse);

router.route("/:warehouseId").delete(warehousesController.deleteWarehouse);

router.route("/").post(warehousesController.addWarehouse);


// GET /api/warehouses/:id/inventories
router
  .route("/:warehouseId/inventories")
  .get(warehousesController.allInventoriesforWarehouse);

router.route("/:id").get(warehousesController.addWarehouse);

router.route("/:id").put(warehousesController.updateWarehouse);

module.exports = router;
