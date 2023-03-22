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
        "Please make sure to provide name, manager, address, phone and email fields in a request"
      );
  }

  knex("warehouse")
    .insert(req.body)
    .then((data) => {
      // For POST requests we need to respond with 201 and the location of the newly created record
      const newWarehouseURL = `/warehouses/${data[0]}`;
      res.status(201).location(newWarehouseURL).send(newWarehouseURL);
    })
    .catch((err) => res.status(400).send(`Error creating Warehouse: ${err}`));
};
