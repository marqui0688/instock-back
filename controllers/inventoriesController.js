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

// exports.??? = (req, res) => {
// };
