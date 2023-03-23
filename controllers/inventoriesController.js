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
      // console.log(data[0]);
      const newWarehouseURL = `/api/inventories/${data[0]}`;
      res.status(201).location(newWarehouseURL).send(newWarehouseURL);
    })
    .catch((err) => res.status(400).send(`Error creating Warehouse: ${err}`));
};


exports.deleteInventory = (req, res) => {
  knex("inventories")
    .delete()
    .where({ id: req.params.id })
    .then( () => {
      // For DELETE response we can use 204 status code
      res
        .status(204)
        .send(`Inventory item with id: ${req.params.id} has been deleted`);
    })
    .catch((err) =>
      res.status(400).send(`Error deleting inventory item ${req.params.id} ${err}`)
    );
};
