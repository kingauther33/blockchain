const SuperBasicFaucetContract = artifacts.require('SuperBasicFaucet');

module.exports = function (deployer) {
	deployer.deploy(SuperBasicFaucetContract);
};
