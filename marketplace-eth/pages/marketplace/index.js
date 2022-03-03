import { useWalletInfo } from '@components/hooks/web3';
import { Button } from '@components/ui/common';
import { CourseCard, CourseList } from '@components/ui/course';
import { BaseLayout } from '@components/ui/layout';
import { MarketHeader } from '@components/ui/marketplace';
import { OrderModal } from '@components/ui/order';
import { getAllCourse } from '@content/courses/fetcher';
import { useState } from 'react';

export default function MarketPlace({ courses }) {
	const [selectedCourse, setSelectedCourse] = useState(null);
	const { canPurchaseCourse } = useWalletInfo();

	const purchaseCourse = (order) => {
		alert(JSON.stringify(order));
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
