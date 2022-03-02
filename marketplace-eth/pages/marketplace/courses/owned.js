import React from 'react';
import { MarketHeader } from '@components/ui/marketplace';
import { OwnedCourseCard } from '@components/ui/course';
import { BaseLayout } from '@components/ui/layout';

export default function OwnedCourses() {
	return (
		<>
			<div className="pt-4">
				<MarketHeader />
			</div>
			<section className="grid grid-cols-1">
				<OwnedCourseCard />
			</section>
		</>
	);
}

OwnedCourses.Layout = BaseLayout;
