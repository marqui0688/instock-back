const router = require("express").Router();
const warehousesController = require("../controllers/warehousesController");

router.route("/").get(warehousesController.index);

router.route("/").post(warehousesController.addWarehouse);


module.exports = router;
