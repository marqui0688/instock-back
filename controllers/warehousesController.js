/** @format */
const crypto = require("crypto");
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

//add warehouse
exports.addWarehouse = (req, res) => {
  // Validate the request body for required data
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
    .then((data) => {
      // For POST requests we need to respond with 201 and the location of the newly created record
      const newWarehouseURL = `/api/warehouses/${data[0]}`;
      res.status(201).location(newWarehouseURL).send(newWarehouseURL);
    })
    .catch((err) => res.status(400).send(`Error creating Warehouse: ${err}`));
};

// GET /api/warehouses/5bf7bd6c-2b16-4129-bddc-9d37ff8539e9/inventories
exports.allInventoriesforWarehouse = (req, res) => {
  knex
    .select("*")
    .from("warehouses")
    .leftJoin("inventories", function () {
      this.on("warehouses.id", "=", "inventories.warehouse_id");
    })
    .where({ "warehouses.id": req.params.warehouseId })
    .then((data) => {
      // if the Inventory is empty on a legit warehouse, the data in res will be EXACLTY length 1 on a LEFT JOIN
      if (data.length === 1) {
        // console.log(req.params.warehouseId);
        console.log("inventories are empty");
        return res.status(200).json(data);
      }
      if (!data.length) {
        // Response returns 404 if warehouse ID is not found
        return res
          .status(404)
          .send(
            `Record with ID: ${req.params.id} is not found. OR Warehouse's inventories are empty`
          );
      }
      // Response returns 200 if warehouse exists
      res.status(200).json(data);
    })
    .catch((err) =>
      res
        .status(400)
        .send(`Warehouse ID: ${req.params.id} is not found; ${err}`)
    );
};

//get sincgle warehouse
exports.getSingleWarehouse = (req, res) => {
  knex("warehouses")
    .where({ id: req.params.id })
    .then((data) => {
      // If record is not found, respond with 404
      if (!data.length) {
        return res
          .status(404)
          .send(`Record with id: ${req.params.id} is not found`);
      }
      // Knex returns an array of records, so we need to send response with a single object only
      res.status(200).json(data[0]);
    })
    .catch((err) =>
      res.status(400).send(`Error retrieving warehouse ${req.params.id} ${err}`)
    );
};

//edit / update  warehouse
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

//delete  warehouse
exports.deleteWarehouse = (req, res) => {
  knex("warehouses")
    .delete()
    .where({ id: req.params.warehouseId })
    .then((data) => res.status(200).json(data))
    .catch((err) =>
      res.status(404).send(`Error deleting Warehouse ${req.params.id} ${err}`)
    );
};
