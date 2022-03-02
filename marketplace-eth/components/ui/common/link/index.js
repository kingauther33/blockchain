import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function ActiveLink({ children, activeLinkClass, ...props }) {
	const { pathname } = useRouter();
	const defaultClass = '';
	let className = children.props.className || ''; // children is the <a> element
	console.log(props);

	if (pathname === props.href) {
		className = ` ${
			activeLinkClass ? activeLinkClass : 'text-indigo-500'
		} ${className}`;
	}

	console.log(className);

	return <Link {...props}>{React.cloneElement(children, { className })}</Link>;
}
