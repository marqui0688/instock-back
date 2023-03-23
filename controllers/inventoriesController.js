/** @format */

const knex = require("knex")(require("../knexfile"));
const crypto = require("crypto");

// to use: send Get to http://localhost:8080/api/inventories
exports.index = (_req, res) => {
  knex("inventories")
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) =>
      res.status(400).send(`Error retrieving Inventories: ${err}`)
    );
};

exports.addInventory = (req, res) => {
  // Validate the request body for required data
  const id = crypto.randomUUID();

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
    .insert(req.body, id)
    .then((data) => {
      // For POST requests we need to respond with 201 and the location of the newly created record
      const newWarehouseURL = `/api/inventories/${data[0]}`;
      res.status(201).location(newWarehouseURL).send(newWarehouseURL);
    })
    .catch((err) => res.status(400).send(`Error creating Warehouse: ${err}`));
};

exports.deleteInventory = (req, res) => {
  knex("inventories")
    .delete()
    .where({ id: req.params.id })
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
      // remove from the obj NOT from db
      // delete data[0].warehouse_id;
      // delete data[0].created_at;
      // delete data[0].updated_at;
      // Response returns 200 if successful
      res.status(200).json(data);
    })
    .catch((err) =>
      // Response returns 404 if the ID is not found
      res.status(404).send(`The ID: ${req.params.id} is not found; ${err}`)
    );
};
