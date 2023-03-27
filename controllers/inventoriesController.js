/** @format */

const knex = require("knex")(require("../knexfile"));
const crypto = require("crypto");

// to use: send Get to http://localhost:8080/api/inventories
exports.index = (_req, res) => {
  // Note: The warehouse name for each inventory item must also be included in the response
  knex("inventories")
    .select(
      "inventories.id",
      "inventories.item_name",
      "inventories.description",
      "inventories.category",
      "inventories.status",
      "inventories.quantity",
      "warehouses.warehouse_name"
    )
    .join("warehouses", "inventories.warehouse_id", "warehouses.id")
    .then((data) => {
      // Response returns 200 if successful
      res.status(200).json(data);
    })
    .catch((err) =>
      res.status(400).send(`Error retrieving Inventories: ${err}`)
    );
};

exports.addInventory = (req, res) => {
  // Validate the request body for required data
  const id = crypto.randomUUID();
  const warehouse_id = req.body.warehouse_id
  console.log(req.body)

  if (
    !req.body.warehouse_id ||
    !req.body.item_name ||
    !req.body.description ||
    !req.body.category ||
    // !req.body.status ||
    !req.body.quantity
  ) {
    return res.status(400).send("Please fill in all fields");
  }

  knex("inventories")
    .insert({...req.body, warehouse_id, id})
    .then((data) => {
      // For POST requests we need to respond with 201 and the location of the newly created record
      console.log(data)
      const newWarehouseURL = `/api/inventories/${id}`;
      res.status(201).location(newWarehouseURL).send(newWarehouseURL);
    })
    .catch((err) => res.status(400).send(`Error adding inventory item: ${err}`));
};

exports.deleteInventory = (req, res) => {
  knex("inventories")
    .where({ id: req.params.id })
    .delete()
    .then(() => {
      // For DELETE response we can use 204 status code
      res
        .status(204)
        .send(`Inventory item with id: ${req.params.id} has been deleted`);
    })
    .catch((err) =>
      res
        .status(400)
        .send(`Error deleting inventory item ${req.params.id} ${err}`)
    );
};

// GET /api/inventories/043a70e2-cf28-4ce1-a9a4-e5b3fac9c593
exports.getSingleInventory = (req, res) => {
  // Note: The warehouse name must also be included in the response.
  knex("inventories")
    .select(
      "inventories.id",
      "inventories.item_name",
      "inventories.description",
      "inventories.category",
      "inventories.status",
      "inventories.quantity",
      "warehouses.warehouse_name"
    )
    .join("warehouses", "inventories.warehouse_id", "warehouses.id")
    .where({ "inventories.id": req.params.inventoryId })
    .then((data) => {
      // If record is not found, respond with 404
      if (!data.length) {
        return res
          .status(404)
          .send(`Record with id: ${req.params.id} is not found`);
      }
      // Response returns 200 if successful
      res.status(200).json(data);
    })
    .catch((err) =>
      // Response returns 400 if an err
      res
        .status(400)
        .send(`Error retrieving inventories id: ${req.params.id} ${err}`)
    );
};


//edit / update  warehouse
exports.updateInventory = (req, res) => {

 if (
   !req.body.warehouse_id ||
   !req.body.item_name ||
   !req.body.description ||
   !req.body.category ||
   !req.body.status ||
   !req.body.quantity
 ) {
   return res.status(400).send("Please fill in all fields");
 }

  knex("inventories")
    .update(req.body)
    .where({ id: req.params.id })
    .then(() => {
      res
        .status(200)
        .send(`Item with id: ${req.params.id} has been updated`);
    })
    .catch((err) =>
      res.status(400).send(`Error updating item ${req.params.id} ${err}`)
    );
};
