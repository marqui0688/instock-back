const router = require("express").Router();
const warehousesController = require("../controllers/warehousesController");

router
  .route("/")
  .get(warehousesController.index)
  .post(warehousesController.addWarehouse);

router.route("/:warehouseId").delete(warehousesController.deleteWarehouse);

// GET /api/warehouses/:id/inventories will be called ONLY if warehouse_id exists 
router
  .route("/:warehouseId/inventories")
  .get(warehousesController.allInventoriesforWarehouse);

router.route("/:id").get(warehousesController.getSingleWarehouse);

router.route("/:id").put(warehousesController.updateWarehouse);

module.exports = router;
