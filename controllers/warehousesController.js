/** @format */
const crypto = require("crypto");
const knex = require("knex")(require("../knexfile"));

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
  const id = crypto.randomUUID();
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
    return res.status(400).send("Please fill in all fields");
  }
  knex("warehouses")
    .insert(req.body, id)
    .then((_data) => {
      // WARNING! For POST requests we need to respond with 201 AND the location of the newly created record
      const newWarehouseURL = `/api/warehouses/${id}`;
      res.status(201).location(newWarehouseURL).send(newWarehouseURL);
    })
    .catch((err) => res.status(400).send(`Error creating Warehouse: ${err}`));
};

exports.allInventoriesforWarehouse = (req, res) => {
  knex
    .select("*")
    .from("warehouses")
    .leftJoin("inventories", function () {
      this.on("warehouses.id", "=", "inventories.warehouse_id");
    })
    .where({ "warehouses.id": req.params.warehouseId })
    .then((data) => {
      if (!data.length) {
        return res
          .status(404)
          .send(`Record with warehouse ID: ${req.params.id} is not found`);
      }
      res.status(200).json(data);
    })
    .catch((err) =>
      res
        .status(400)
        .send(`Warehouse ID: ${req.params.id} is not found; ${err}`)
    );
};

exports.getSingleWarehouse = (req, res) => {
  knex("warehouses")
    .where({ id: req.params.id })
    .then((data) => {
      if (!data.length) {
        return res
          .status(404)
          .send(`Record with id: ${req.params.id} is not found`);
      }
      res.status(200).json(data[0]);
    })
    .catch((err) =>
      res.status(400).send(`Error retrieving warehouse ${req.params.id} ${err}`)
    );
};

exports.updateWarehouse = (req, res) => {
  knex("warehouses")
    .update(req.body)
    .where({ id: req.params.id })
    .then(() => {
      res
        .status(200)
        .send(`Warehouse with id: ${req.params.id} has been updated`);
    })
    .catch((err) =>
      res.status(400).send(`Error updating Warehouse ${req.params.id} ${err}`)
    );
};

exports.deleteWarehouse = (req, res) => {
  knex("warehouses")
    .delete()
    .where({ id: req.params.warehouseId })
    .then((data) => res.status(200).json(data))
    .catch((err) =>
      res.status(404).send(`Error deleting Warehouse ${req.params.id} ${err}`)
    );
};
