const router = require("express").Router();
const inventoriesController = require("../controllers/inventoriesController");

router.route("/").get(inventoriesController.index);

module.exports = router;
