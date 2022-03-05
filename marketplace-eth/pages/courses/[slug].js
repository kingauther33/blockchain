import { Modal } from '@components/ui/common';
import {
	CourseCurriculum,
	CourseHero,
	CourseKeypoints,
} from '@components/ui/course';
import { BaseLayout } from '@components/ui/layout';
import Router from 'next/router';
import { getAllCourse } from '@content/courses/fetcher';
import { useOwnedCourse, useAccount } from '@components/hooks/web3';

export default function Course({ course }) {
	const { account } = useAccount();
	const { ownedCourse } = useOwnedCourse(course, account.data);

	console.log(ownedCourse)

	return (
		<>
			<div className="py-4">
				<CourseHero
					title={course.title}
					description={course.description}
					image={course.coverImage}
				/>
			</div>

			<CourseKeypoints points={course.wsl} />
			<CourseCurriculum locked={true} />
			<Modal />
		</>
	);
}

export function getStaticPaths() {
	const { data } = getAllCourse();

	return {
		paths: data.map((c) => ({
			params: {
				slug: c.slug,
			},
		})),
		fallback: false,
	};
}

export function getStaticProps({ params }) {
	const { data } = getAllCourse();
	const course = data.filter((c) => c.slug === params.slug)[0];

	return {
		props: { course },
	};
}

Course.Layout = BaseLayout;
