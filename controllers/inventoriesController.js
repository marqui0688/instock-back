const knex = require("knex")(require("../knexfile"));

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

  knex("inventories")
    .insert(req.body, id)
    .then((data) => {
      // For POST requests we need to respond with 201 and the location of the newly created record
      console.log(data[0]);
      const newWarehouseURL = `/api/inventory/${data[0]}`;
      res.status(201).location(newWarehouseURL).send(newWarehouseURL);
    })
    .catch((err) => res.status(400).send(`Error creating Warehouse: ${err}`));
};
