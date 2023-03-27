const router = require("express").Router();
const warehousesController = require("../controllers/warehousesController");

router
  .route("/")
  .get(warehousesController.index)
  .post(warehousesController.addWarehouse);

router.route("/:warehouseId").delete(warehousesController.deleteWarehouse);

router
  .route("/:warehouseId/inventories")
  .get(warehousesController.allInventoriesforWarehouse);

router.route("/:id").get(warehousesController.getSingleWarehouse);

router.route("/:id").put(warehousesController.updateWarehouse);

router.route("/").post(warehousesController.addWarehouse);

module.exports = router;
