const router = require("express").Router();
const inventoriesController = require("../controllers/inventoriesController");

router.route("/").get(inventoriesController.index);
// router.route("/").post(inventoriesController.???);

module.exports = router;