const router = require("express").Router();
const warehousesController = require("../controllers/warehousesController");

router.route("/").get(warehousesController.index);

module.exports = router;
