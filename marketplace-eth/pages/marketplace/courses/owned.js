import React from 'react';
import { MarketHeader } from '@components/ui/marketplace';
import { OwnedCourseCard } from '@components/ui/course';
import { BaseLayout } from '@components/ui/layout';
import { Button, Message } from '@components/ui/common';

export default function OwnedCourses() {
	return (
		<>
			<div className="pt-4">
				<MarketHeader />
			</div>
			<section className="grid grid-cols-1">
				<OwnedCourseCard>
					<Message type="danger">My Custom Message</Message>
					<Button>Watch the course</Button>
				</OwnedCourseCard>
			</section>
		</>
	);
}

OwnedCourses.Layout = BaseLayout;
