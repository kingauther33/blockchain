import { useEthPrice } from '@components/hooks/useEthPrice';
import { Button, Modal } from '@components/ui/common';
import React, { useState, useEffect } from 'react';

const defaultOrder = {
	price: '',
	email: '',
	confirmationEmail: '',
};

const _createFormState = (isDisabled = false, message = '') => ({
	isDisabled,
	message,
});

const createFormState = (ETHToMYR, price, hasAgreedTOS) => {
	if (!price || Number(price) <= 0) {
		return _createFormState(true, 'Price is not valid');
	}

	if (!ETHToMYR || Number(ETHToMYR) < 0) {
		return _createFormState(true, 'ETH to MYR is not valid');
	}

	if (!hasAgreedTOS) {
		return _createFormState(
			true,
			'You need to agree with terms of service in order to submit the form.'
		);
	}
	return _createFormState();
};

export default function DepositModal() {
	const [isOpen, setIsOpen] = useState(true);
	const [enablePrice, setEnablePrice] = useState(false);
	const [hasAgreedTOS, setHasAgreedTOS] = useState(false);
	const [ETHToMYR, setETHToMYR] = useState(0);
	const { eth } = useEthPrice();
	const [price, setPrice] = useState(eth.perItem);

	const closeModal = () => {
		setIsOpen(false);
	};

	useEffect(() => {
		setPrice(eth.perItem);
	}, [eth.perItem]);

	const formState = createFormState(ETHToMYR, price, hasAgreedTOS);

	return (
		<Modal isOpen={isOpen}>
			<div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
				<div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
					<div className="sm:flex sm:items-start">
						<div className="mt-3 sm:mt-0 sm:ml-4 sm:text-left">
							<h3
								className="mb-7 text-lg font-bold leading-6 text-gray-900"
								id="modal-title"
							>
								Buy Myrmica Token
							</h3>
							<div className="mt-1 relative rounded-md">
								<div className="mb-1">
									<label className="mb-2 font-bold">Price(eth)</label>
									<div className="text-xs text-gray-700 flex">
										<label className="flex items-center mr-2">
											<input
												checked={enablePrice}
												onChange={({ target: { checked } }) => {
													setEnablePrice(checked);
													setPrice(eth.perItem);
												}}
												type="checkbox"
												className="form-checkbox"
											/>
										</label>
									</div>
								</div>
								<input
									disabled={!enablePrice}
									value={price}
									onChange={({ target: { value } }) => {
										if (isNaN(value)) {
											return;
										}
										setPrice(value);
									}}
									type="text"
									name="price"
									id="price"
									className="disabled:opacity-50 w-80 mb-1 focus:ring-indigo-500 shadow-md focus:border-indigo-500 block pl-7 p-4 sm:text-sm border-gray-300 rounded-md"
								/>
								<p className="text-xs text-gray-700">
									Price will be verified at the time of the order. If the price
									will be lower, order can be declined (+- 2% slipage is
									allowed)
								</p>
							</div>

							<div className="mt-2 relative rounded-md">
								<div className="mb-1">
									<label className="mb-2 font-bold">ETH to MYR</label>
								</div>
								<input
									value={ETHToMYR}
									onChange={({ target: { value } }) => {
										setETHToMYR(value);
									}}
									type="number"
									name="ETHToMYR"
									id="ETHToMYR"
									className="w-80 focus:ring-indigo-500 shadow-md focus:border-indigo-500 block pl-7 p-4 sm:text-sm border-gray-300 rounded-md"
								/>
								<p className="text-xs text-gray-700 mt-1">
									It&apos;s important to flil a correct value to correctly
									transfer ETH to MYR
								</p>
							</div>

							<div className="text-xs text-gray-700 flex mt-5">
								<label className="flex items-center mr-2">
									<input
										value={hasAgreedTOS}
										onChange={({ target: { checked } }) => {
											setHasAgreedTOS(checked);
										}}
										type="checkbox"
										className="form-checkbox"
									/>
								</label>
								<span>
									I accept Eincode &apos;terms of service&apos; and I agree that
									my order can be rejected in the case data provided above are
									not correct
								</span>
							</div>

							<div className="mt-2 relative rounded-md">
								<h2 className="text-base text-indigo-700 mt-1">
									Total MYR token received:{' '}
									{(price * ETHToMYR * 10000).toFixed(2)}
								</h2>
							</div>

							{formState.message && (
								<div className="p-4 my-3 text-yellow-700 bg-yellow-200 rounded-lg text-sm">
									{formState.message}
								</div>
							)}
						</div>
					</div>
				</div>
				<div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex">
					<Button
						disabled={formState.isDisabled}
						onClick={() => {
							onSubmit(order, game);
						}}
					>
						Submit
					</Button>
					<Button onClick={closeModal} variant="red">
						Cancel
					</Button>
				</div>
			</div>
		</Modal>
	);
}
