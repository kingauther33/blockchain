const CourseMarketplace = artifacts.require('CourseMarketplace');
const { catchRevert } = require('./utils/exceptions');

// Mocha - testing framework
// Chai - assertion JS library

contract('CourseMarketplace', (accounts) => {
	const courseId = '0x00000000000000000000000000003130';
	const proof =
		'0x0000000000000000000000000000313000000000000000000000000000003130';

	const courseId2 = '0x00000000000000000000000000002130';
	const proof2 =
		'0x0000000000000000000000000000213000000000000000000000000000002130';

	const value = '900000000';

	let _contract = null;
	let contractOwner = null;
	let buyer = null;
	let courseHash = null;

	before(async () => {
		_contract = await CourseMarketplace.deployed();
		contractOwner = accounts[0];
		buyer = accounts[1];
	});

	describe('Purchase the new course', () => {
		before(async () => {
			await _contract.purchaseCourse(courseId, proof, {
				from: buyer,
				value,
			});
		});

		it('should NOT allow to repurchase already owned course', async () => {
			await catchRevert(
				_contract.purchaseCourse(courseId, proof, {
					from: buyer,
					value,
				})
			);
		});

		it('can get the purchased course hash by index', async () => {
			const index = 0;
			courseHash = await _contract.getCourseHashAtIndex(index);

			const actualHash = web3.utils.soliditySha3(
				{ type: 'bytes16', value: courseId },
				{ type: 'address', value: buyer }
			);

			assert.equal(
				courseHash,
				actualHash,
				'Course hash is not matching the has of purchased course'
			);
		});

		it('should match the purchased data of the course purchased by buyer', async () => {
			const expectedIndex = 0;
			const expectedState = 0;
			const course = await _contract.getCourseByHash(courseHash);

			assert.equal(
				course.id,
				expectedIndex,
				`Course index should be ${expectedIndex}.`
			);
			assert.equal(course.price, value, `Course price should be ${value}.`);
			assert.equal(course.proof, proof, `Course proof should be ${proof}.`);
			assert.equal(course.owner, buyer, `Course index should be ${buyer}.`);
			assert.equal(
				course.state,
				expectedState,
				`Course index should betr ${expectedState}.`
			);
		});
	});

	describe('Activate the purchased course', () => {
		it('should NOT be able to activate course by NOT contract owner', async () => {
			await catchRevert(_contract.activateCourse(courseHash, { from: buyer }));
		});

		it("should have 'activated' state", async () => {
			await _contract.activateCourse(courseHash, { from: contractOwner });
			const course = await _contract.getCourseByHash(courseHash);
			const expectedState = 1;

			console.log(course);

			assert.equal(
				course.state,
				expectedState,
				"Course should have 'activated' state"
			);
		});
	});

	describe('Transfer ownership', () => {
		let currentOwner = null;

		before(async () => {
			currentOwner = await _contract.getContractOwner();
		});

		it('getContractOwner should return deployer address', async () => {
			assert.equal(
				contractOwner,
				currentOwner,
				'Contract owner is not matching the one from getContractOwner function'
			);
		});

		it('should NOT transfer ownership when contractOwner is not sending TX', async () => {
			await catchRevert(
				_contract.transferOwnership(accounts[3], { from: accounts[4] })
			);
		});

		it("should transfer ownership to 3rd address from 'accounts'", async () => {
			await _contract.transferOwnership(accounts[4], { from: contractOwner });
			const owner = await _contract.getContractOwner();
			assert.equal(
				owner,
				accounts[4],
				'Contract owner is not the second account'
			);
		});

		it('should transfer ownership back to initial contract owner', async () => {
			await _contract.transferOwnership(contractOwner, { from: accounts[4] });
			const owner = await _contract.getContractOwner();
			assert.equal(owner, contractOwner, 'Contract owner is not set');
		});
	});

	describe('Deactivate course', () => {
		let courseHash2 = null;

		before(async () => {
			await _contract.purchaseCourse(courseId2, proof2, { from: buyer, value });
			courseHash2 = await _contract.getCourseHashAtIndex(1);
		});

		it('should NOT be able to deactivate the course by NOT contract owner', async () => {
			await catchRevert(
				_contract.deactivateCourse(courseHash2, { from: buyer })
			);
		});

		it('should have status of deactivated and price 0', async () => {
			await _contract.deactivateCourse(courseHash2, { from: contractOwner });
			const course = await _contract.getCourseByHash(courseHash2);
			const expectedState = 2;
			const expectedPrice = 0;

			console.log(course.state);
			console.log(course.price);

			assert.equal(course.state, expectedState, 'Course is NOT deactivated');
			assert.equal(course.price, expectedPrice, 'Course price is NOT 0');
		});

		it('should NOT be able to activate deactivated course', async () => {
			await catchRevert(
				_contract.deactivateCourse(courseHash2, { from: contractOwner })
			);
		});
	});
});