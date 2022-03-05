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

	const purchaseCourse = async (order) => {
		const hexCourseId = web3.utils.utf8ToHex(selectedCourse.id);

		const orderHash = web3.utils.soliditySha3(
			{ type: 'bytes16', value: hexCourseId },
			{ type: 'address', value: account.data }
		);

		const emailHash = web3.utils.sha3(order.email);

		const proof = web3.utils.soliditySha3(
			{ type: 'bytes32', value: emailHash },
			{ type: 'bytes32', value: orderHash }
		);

		const value = web3.utils.toWei(String(order.price), 'ether');

		console.log(hexCourseId);
		console.log(orderHash);
		console.log(proof);
		console.log(value);

		try {
			const results = await contract.methods
				.purchaseCourse(String(hexCourseId), String(proof))
				.send({ from: account.data, value });
			// const results = await contract.purchaseCourse(
			// 	String(hexCourseId),
			// 	String(proof),
			// 	{ from: account.data, value: String(value) }
			// );
			console.log(results);
		} catch {
			console.error('Purchase course: Operation has failed.');
		}
	};

	return (
		<>
			<MarketHeader />
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
