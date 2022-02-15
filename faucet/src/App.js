import React, { useEffect, useState, useCallback } from 'react';
import Web3 from 'web3';
import './App.css';
import detectEthereumProvider from '@metamask/detect-provider';
import { loadContract } from './utils/load-contracts';

function App() {
	const [web3Api, setWeb3Api] = useState({
		provider: null,
		isProviderLoaded: false,
		web3: null,
		contract: null,
	});

	const [balance, setBalance] = useState(null);
	const [account, setAccount] = useState(null);
	const [shouldReload, reload] = useState(false);

	const canConnectToContract = account && web3Api.contract;
	const reloadEffect = useCallback(() => reload(!shouldReload), [shouldReload]);

	const setAccountListener = (provider) => {
		provider.on('accountsChanged', (_) => window.location.reload());

		provider.on('chainChanged', (_) => window.location.reload());
	};

	useEffect(() => {
		const loadProvider = async () => {
			const provider = await detectEthereumProvider();

			if (provider) {
				const contract = await loadContract('Faucet', provider);
				setAccountListener(provider);
				setWeb3Api({
					web3: new Web3(provider),
					provider,
					contract,
					isProviderLoaded: true,
				});
			} else {
				setWeb3Api((prevState) => ({
					...prevState,
					isProviderLoaded: true,
				}));
				console.error('Please install Metamask.');
			}
		};

		loadProvider();
	}, []);

	useEffect(() => {
		const loadBalance = async () => {
			const { contract, web3 } = web3Api;
			const balance = await web3.eth.getBalance(contract.address);
			setBalance(web3.utils.fromWei(balance, 'ether'));
		};

		web3Api.contract && loadBalance();
	}, [web3Api, shouldReload]);

	useEffect(() => {
		const getAccount = async () => {
			const accounts = await web3Api.web3.eth.getAccounts();
			setAccount(accounts[0]);
		};

		web3Api.web3 && getAccount();
	}, [web3Api.web3]);

	const addFunds = useCallback(async () => {
		const { contract, web3 } = web3Api;
		await contract.addFunds({
			from: account,
			value: web3.utils.toWei('1', 'ether'),
		});

		// window.location.reload();
		reloadEffect();
	}, [web3Api, account, reloadEffect]);

	const withdraw = useCallback(async () => {
		const { contract, web3 } = web3Api;
		const withdrawAmount = web3.utils.toWei('0.1', 'ether');
		await contract.withdraw(withdrawAmount, {
			from: account,
		});
		reloadEffect();
	}, [reloadEffect, web3Api, account]);

	return (
		<>
			<div className="faucet-wrapper">
				<div className="faucet">
					{web3Api.isProviderLoaded ? (
						<div className="is-flex is-align-items-center gap-4">
							<span>
								<strong className="mr-2">Account: </strong>
							</span>
							{account ? (
								<span>{account}</span>
							) : !web3Api.provider ? (
								<>
									<div className="notification is-warning is-size-6 is-rounded">
										Wallet is not detected!{` `}
										<a
											target="_blank"
											href="https://docs.metamask.io"
											rel="noreferrer"
										>
											Install metamask
										</a>
									</div>
								</>
							) : (
								<button
									className="button is-small"
									onClick={() => {
										web3Api.provider.request({ method: 'eth_requestAccounts' });
									}}
								>
									Connect wallet
								</button>
							)}
						</div>
					) : (
						<span>Looking for Web3...</span>
					)}
					<div className="balance-view is-size-2 my-4">
						Current balance: <strong>{balance}</strong> ETH
					</div>
					{!canConnectToContract && (
						<i className="is-block">Connect to ganache</i>
					)}
					<button
						className="button is-link mr-2"
						onClick={addFunds}
						disabled={!canConnectToContract}
					>
						Donate 1 ETH
					</button>
					<button
						onClick={withdraw}
						className="button is-primary"
						disabled={!canConnectToContract}
					>
						Withdraw 0.1 ETH
					</button>
				</div>
			</div>
		</>
	);
}

export default App;

// Private key 32 byte number
// ecdc073249b1f8c0c9dca3a974a7a928b4f8946a75f746cdf4878d12757ce444

// Public key(Uncompressed) 64 byte number
// 0413823c1237fdf7222c75c7f49d0d9f20c214b50aac53939585038196ff25d86cfa45285b3f42b41186ddacffa9b19780cb853ad5acd7484a6698dac2601661b4

// Public key(Compressed) 33 byte number
// 0213823c1237fdf7222c75c7f49d0d9f20c214b50aac53939585038196ff25d86c
