const { seedSuperAdmin } = require("./superadmin");
const { seedLocations } = require("./locations");
const { seedBuses } = require("./buses");

const runSeed = () => {
  seedSuperAdmin();
  seedLocations();
  seedBuses();
};

module.exports = runSeed;
