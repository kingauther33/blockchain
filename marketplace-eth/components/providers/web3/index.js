import { createContext, useContext, useEffect, useMemo } from 'react';
import detectEthereumProvider from '@metamask/detect-provider';
import Web3 from 'web3';
import { useState } from 'react';
import { setupHooks } from './hooks/setupHooks';
import { loadContract } from '@utils/loadContract';

const Web3Context = createContext(null);

export default function Web3Provider({ children }) {
	const [web3Api, setWeb3Api] = useState({
		provider: null,
		web3: null,
		contract: null,
		isLoading: true,
		hooks: setupHooks(),
	});

	useEffect(() => {
		const loadProvider = async () => {
			const provider = await detectEthereumProvider();

			if (provider) {
				const web3 = new Web3(provider);
				const contract = await loadContract('CourseMarketplace', web3);
				console.log(contract);

				setWeb3Api({
					provider,
					web3,
					contract,
					isLoading: false,
					hooks: setupHooks(web3, provider),
				});
			} else {
				setWeb3Api((api) => ({ ...api, isLoading: false }));
				console.error('Please install Metamask');
			}
		};

		loadProvider();
	}, []);

	const _web3Api = useMemo(() => {
		const { web3, isLoading, provider } = web3Api;

		return {
			...web3Api,
			requireInstall: !isLoading && !web3,
			connect: provider
				? async () => {
						try {
							console.log('Here');
							await provider.request({ method: 'eth_requestAccounts' });
						} catch {
							console.error('Cannot retrieve account!');
						}
				  }
				: () =>
						console.error(
							'Cannot connect to Metamask, try to reload your browser please.'
						),
		};
	}, [web3Api]);

	return (
		<Web3Context.Provider value={_web3Api}>{children}</Web3Context.Provider>
	);
}

export const useWeb3 = () => {
	return useContext(Web3Context);
};

export function useHooks(cb) {
	const { hooks } = useWeb3();
	return cb(hooks);
}
