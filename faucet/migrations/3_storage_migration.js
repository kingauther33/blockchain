const StorageMigration = artifacts.require('Storage');

module.exports = function (deployer) {
	deployer.deploy(StorageMigration);
};
