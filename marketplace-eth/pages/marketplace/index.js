import { useWalletInfo } from '@components/hooks/web3';
import { Button } from '@components/ui/common';
import { CourseCard, CourseList } from '@components/ui/course';
import { BaseLayout } from '@components/ui/layout';
import { MarketHeader } from '@components/ui/marketplace';
import { OrderModal } from '@components/ui/order';
import { getAllCourse } from '@content/courses/fetcher';
import { useState } from 'react';
import { useWeb3 } from '@components/providers';

export default function MarketPlace({ courses }) {
	const { web3, contract } = useWeb3();
	const { canPurchaseCourse, account } = useWalletInfo();
	const [selectedCourse, setSelectedCourse] = useState(null);

	const purchaseCourse = (order) => {
		const hexCourseId = web3.utils.utf8ToHex(selectedCourse.id);

		// hexCourseId
		// 0x31343130343734000000000000000000

		// address
		// 0x74C8AB04E91bdD1e70f0B6d9e0Fcbcc3C06d6b3F

		// 3134313034373400000000000000000074C8AB04E91bdD1e70f0B6d9e0Fcbcc3C06d6b3F

		console.log(hexCourseId);

		const orderHash = web3.utils.soliditySha3(
			{ type: 'bytes16', value: hexCourseId },
			{ type: 'address', value: account.data }
		);

		// Order Hash
		// keccak256 - fc69c68ee4a49656e0306bddcdd6b8f48b5c43f178474a7073027244ceeda917

		console.log(orderHash);

		const emailHash = web3.utils.sha3(order.email);

		// Email Hash
		// 0x67df77adbc271f558df88504cf3a3f87bfdd2d55b11e86c55c4fd978a935a836
		console.log(emailHash);

		// 67df77adbc271f558df88504cf3a3f87bfdd2d55b11e86c55c4fd978a935a836fc69c68ee4a49656e0306bddcdd6b8f48b5c43f178474a7073027244ceeda917
		// Proof: keccak 256
		// 13883f2012d814be822775c489e3c8e8ef1c996f314713aef98004bcc9251fee

		const proof = web3.utils.soliditySha3(
			{ type: 'bytes32', value: emailHash },
			{ type: 'bytes32', value: orderHash }
		);

		console.log(proof);

		// emailHash + courseHash
	};

	return (
		<>
			<div className="pt-4">
				<MarketHeader />
			</div>

			<CourseList courses={courses}>
				{(course) => (
					<CourseCard
						disabled={!canPurchaseCourse}
						key={course.id}
						course={course}
						Footer={() => (
							<div className="mt-4">
								<Button
									disabled={!canPurchaseCourse}
									variant="lightPurple"
									hoverable={canPurchaseCourse}
									onClick={() => {
										setSelectedCourse(course);
									}}
								>
									Purchase
								</Button>
							</div>
						)}
					/>
				)}
			</CourseList>
			{selectedCourse && (
				<OrderModal
					onClose={() => {
						setSelectedCourse(null);
					}}
					onSubmit={purchaseCourse}
					course={selectedCourse}
				/>
			)}
		</>
	);
}

export function getStaticProps() {
	const { data } = getAllCourse();
	return {
		props: {
			courses: data,
		},
	};
}

MarketPlace.Layout = BaseLayout;
