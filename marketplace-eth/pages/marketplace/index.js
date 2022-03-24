import { useWalletInfo, useOwnedCourses } from '@components/hooks/web3';
import { Button, Loader, Message } from '@components/ui/common';
import { CourseCard, CourseList, OwnedCourseCard } from '@components/ui/course';
import { BaseLayout } from '@components/ui/layout';
import { MarketHeader } from '@components/ui/marketplace';
import { OrderModal } from '@components/ui/order';
import { getAllCourse } from '@content/courses/fetcher';
import { useState } from 'react';
import { useWeb3 } from '@components/providers';

export default function MarketPlace({ courses }) {
	const { web3, contract, requireInstall } = useWeb3();
	const { hasConnectedWallet, isConnecting, account } = useWalletInfo();
	const { ownedCourses } = useOwnedCourses(courses, account.data);

	const [selectedCourse, setSelectedCourse] = useState(null);
	const [isNewPurchase, setIsNewPurchase] = useState(true);

	const purchaseCourse = async (order) => {
		const hexCourseId = web3.utils.utf8ToHex(selectedCourse.id);

		const orderHash = web3.utils.soliditySha3(
			{ type: 'bytes16', value: hexCourseId },
			{ type: 'address', value: account.data }
		);

		const value = web3.utils.toWei(String(order.price), 'ether');

		if (isNewPurchase) {
			const emailHash = web3.utils.sha3(order.email);
			const proof = web3.utils.soliditySha3(
				{ type: 'bytes32', value: emailHash },
				{ type: 'bytes32', value: orderHash }
			);

			_purchaseCourse(hexCourseId, proof, value);
		} else {
			_repurchaseCourse(orderHash, value);
		}
	};

	const _purchaseCourse = async (hexCourseId, proof, value) => {
		try {
			const results = await contract.methods
				.purchaseCourse(hexCourseId, proof)
				.send({ from: account.data, value });
			console.log(results);
		} catch {
			console.error('Purchase course: Operation has failed.');
		}
	};

	const _repurchaseCourse = async (courseHash, value) => {
		try {
			const results = await contract.methods
				.repurchaseCourse(courseHash)
				.send({ from: account.data, value });
			console.log(results);
		} catch {
			console.error('Purchase course: Operation has failed.');
		}
	};

	return (
		<>
			<MarketHeader />
			<CourseList courses={courses}>
				{(course) => {
					const owned = ownedCourses.lookup[course.id];
					return (
						<CourseCard
							disabled={!hasConnectedWallet}
							key={course.id}
							state={owned?.state}
							course={course}
							Footer={() => {
								if (requireInstall) {
									return (
										<Button
											size="sm"
											disabled={true}
											variant="lightPurple"
											hoverable={hasConnectedWallet}
										>
											Install
										</Button>
									);
								}

								if (isConnecting) {
									return (
										<Button
											size="sm"
											disabled={true}
											variant="lightPurple"
											hoverable={hasConnectedWallet}
										>
											<Loader size="sm" />
										</Button>
									);
								}

								if (!ownedCourses.hasInitialResponse) {
									return <div style={{ height: '42px' }}></div>;
								}

								if (owned) {
									return (
										<>
											<div className="flex">
												<Button
													onClick={() => alert('You are owner of this course')}
													size="sm"
													disabled={false}
													variant="white"
												>
													Yours &#10003;
												</Button>
												{owned.state === 'deactivated' && (
													<div className="ml-1">
														<Button
															size="sm"
															disabled={false}
															variant="purple"
															onClick={() => {
																setIsNewPurchase(false);
																setSelectedCourse(course);
															}}
														>
															Fund to Activate
														</Button>
													</div>
												)}
											</div>
										</>
									);
								}

								return (
									<Button
										size="sm"
										disabled={!hasConnectedWallet}
										variant="lightPurple"
										hoverable={hasConnectedWallet}
										onClick={() => {
											setSelectedCourse(course);
										}}
									>
										Purchase
									</Button>
								);
							}}
						/>
					);
				}}
			</CourseList>
			{selectedCourse && (
				<OrderModal
					isNewPurchase={isNewPurchase}
					onClose={() => {
						setSelectedCourse(null);
						setIsNewPurchase(true);
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
