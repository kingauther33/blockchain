import { Hero } from '@components/ui/common';
import { CourseCard, CourseList } from '@components/ui/course';
import { getAllCourse } from '@content/courses/fetcher';
import { BaseLayout } from '@components/ui/layout';

export default function Home({ courses }) {
	return (
		<>
			<Hero />
			<CourseList courses={courses}>
				{(course) => <CourseCard key={course.id} course={course} />}
			</CourseList>
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

Home.Layout = BaseLayout;