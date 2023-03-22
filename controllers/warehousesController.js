/** @format */
const crypto = require('crypto')
const knex = require("knex")(require("../knexfile"));

// to use: send GET to http://localhost:8080/api/warehouses
exports.index = (_req, res) => {
  knex("warehouses")
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) =>
      res.status(400).send(`Error retrieving Warehouses: ${err}`)
    );
};

exports.addWarehouse = (req, res) => {
  // Validate the request body for required data
const id = crypto.randomUUID()

  if (
    !req.body.warehouse_name ||
    !req.body.address ||
    !req.body.city ||
    !req.body.country ||
    !req.body.contact_name ||
    !req.body.contact_position ||
    !req.body.contact_phone ||
    !req.body.contact_email
  ) {
    return res
      .status(400)
      .send(
        "Please fill in all fields"
      );
  }

  knex("warehouses")
    .insert(req.body, id)
    .then((data) => {
      // For POST requests we need to respond with 201 and the location of the newly created record
      console.log(data[0]);
      const newWarehouseURL = `/api/warehouses/${data[0]}`;
      res.status(201).location(newWarehouseURL).send(newWarehouseURL);
    })
    .catch((err) => res.status(400).send(`Error creating Warehouse: ${err}`));
};
