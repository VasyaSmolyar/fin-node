const Migrations = artifacts.require("PaymentContract");

module.exports = function (deployer) {
  deployer.deploy(Migrations);
};