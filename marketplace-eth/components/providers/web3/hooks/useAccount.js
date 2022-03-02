import { useState, useEffect } from 'react';
import useSWR from 'swr';

const adminAddresses = {
	'0xc43fa5ebab774cf64ead53900fc5176dba2057aa897ce88f56e49a57254b2e6c': true,
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
