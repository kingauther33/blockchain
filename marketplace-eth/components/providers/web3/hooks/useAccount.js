import { useState, useEffect } from 'react';
import useSWR from 'swr';

const adminAddresses = {
	'0x0390aab3a0cd9714f74d3e741b9df7bdead5cd4930fe5e462f02eb8ad7b2835c': true,
};

export const handler = (web3, provider) => () => {
	const { data, mutate, ...rest } = useSWR(
		web3 ? 'web3/accounts' : null,
		async () => {
			const accounts = await web3.eth.getAccounts();
			return accounts[0];
		}
	);

	useEffect(() => {
		provider &&
			provider.on('accountsChanged', (accounts) => mutate(accounts[0] ?? null));
	}, [provider]);

	return {
		data,
		isAdmin: (data && adminAddresses[web3.utils.keccak256(data)]) ?? false,
		mutate,
		...rest,
	};
};
