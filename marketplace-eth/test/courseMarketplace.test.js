const CourseMarketplace = artifacts.require('CourseMarketplace');

// Mocha - testing framework
// Chai - assertion JS library

contract('CourseMarketplace', (accounts) => {
	const courseId = '0x00000000000000000000000000003130';
	const proof =
		'0x0000000000000000000000000000313000000000000000000000000000003130';
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
		let courseHash;
		before(async () => {
			await _contract.purchaseCourse(courseId, proof, {
				from: buyer,
				value,
			});
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
	});

	describe('Activate the purchased course', () => {
		before(async () => {
			await _contract.activateCourse(courseHash, { from: contractOwner });
		});

		it("should have 'activated' status", async () => {
			const course = await _contract.getCourseByHash(courseHash);
			const expectedState = 1;

			assert.equal(
				course.state,
				expectedState,
				"Course should have 'activated' state"
			);
		});
	});
});
