/** @format */
const knex = require("knex")(require("../knexfile"));
const crypto = require("crypto");

exports.index = (_req, res) => {
  // WARNING! The warehouse name for each inventory item must also be included in the response
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
      res.status(200).json(data);
    })
    .catch((err) =>
      res.status(400).send(`Error retrieving Inventories: ${err}`)
    );
};

exports.addInventory = (req, res) => {
  const id = crypto.randomUUID();
  const warehouse_id = req.body.warehouse_id;
  if (
    !req.body.warehouse_id ||
    !req.body.item_name ||
    !req.body.description ||
    !req.body.category ||
    !req.body.quantity
  ) {
    return res.status(400).send("Please fill in all fields");
  }

  knex("inventories")
    .insert({ ...req.body, warehouse_id, id })
    .then((data) => {
      // WARNING! For POST requests we need to respond with 201 AND the location of the newly created record
      const newWarehouseURL = `/api/inventories/${id}`;
      res.status(201).location(newWarehouseURL).send(newWarehouseURL);
    })
    .catch((err) =>
      res.status(400).send(`Error adding inventory item: ${err}`)
    );
};

exports.deleteInventory = (req, res) => {
  knex("inventories")
    .where({ id: req.params.id })
    .delete()
    .then(() => {
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

exports.getSingleInventory = (req, res) => {
  // WARNING! The warehouse name must also be included in the response.
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
      if (!data.length) {
        return res
          .status(404)
          .send(`Record with id: ${req.params.id} is not found`);
      }
      res.status(200).json(data);
    })
    .catch((err) =>
      res
        .status(400)
        .send(`Error retrieving inventories id: ${req.params.id} ${err}`)
    );
};

exports.updateInventory = (req, res) => {
  knex("inventories")
    .update(req.body)
    .where({ id: req.params.id })
    .then(() => {
      res.status(200).send(`Item with id: ${req.params.id} has been updated`);
    })
    .catch((err) =>
      res.status(400).send(`Error updating item ${req.params.id} ${err}`)
    );
};
