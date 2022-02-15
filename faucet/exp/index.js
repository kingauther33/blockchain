// 0xf86c01850c4b201000825208949cbfd6ebdb9cfcccd6b043f43e524583486d455e880490283b23ec8f768025a067da959a6d114d42016b5fb43ff8ae018efe6e4c784d40dfb2f2aad8fb2d4f6ca00b019b1e457b592e5bfd553e3b73742de625c7b65145494a57dbca17e5e9d842;

// 0x
// 01101100
// f8 = f7 + length of payload in binary form in bytes
// 6c = 108 bytes is payload
// 01 - nonce

// 133 - 128 = 5 bytes
// 0x85 - 0x80 = 5 bytes to extract

// 85 0c4b201000 - gasPrice

// 0x82 - 0x80 = 2 bytes
// 82 5208 - gasLimit

// 0x94 - 0x80 = 20 bytes
// 94 9cbfd6ebdb9cfcccd6b043f43e524583486d455e - to

// 0x88 - 0x80 = 8 bytes
// 88 0490283b23ec8f76 - value

// 80 - data

// 0x25 - 1 byte is encoding itself
// 25 = v

// a0 - 0x80 = 32 bytes
// a0 67da959a6d114d42016b5fb43ff8ae018efe6e4c784d40dfb2f2aad8fb2d4f6c = r

// a0 - 0x80 = 32 bytes
// a0 0b019b1e457b592e5bfd553e3b73742de625c7b65145494a57dbca17e5e9d842 = s

// 1 nibble = 4 bits
// 1 byte = 8 bits

const ethUtil = require('ethereumjs-util');
const EthereumTx = require('ethereumjs-tx').Transaction;

const txParams = {
	nonce: '0x01',
	gasPrice: '0x0C4B201000',
	gasLimit: '0x5208',
	to: '0x9cbfd6ebdb9cfcccd6b043f43e524583486d455e',
	from: '0x055b936d7603f0b12b980631884b0628bb10a86e',
	value: '0x0490283B23EC8F76',
	data: '0x', // null, "",
	v: '0x25',
	r: '0x67da959a6d114d42016b5fb43ff8ae018efe6e4c784d40dfb2f2aad8fb2d4f6c',
	s: '0x0b019b1e457b592e5bfd553e3b73742de625c7b65145494a57dbca17e5e9d842',
};

const tx = new EthereumTx(txParams, {
	chain: 'mainnet',
});

const key = tx.getSenderPublicKey();
// keccak256(public key)
// d854623eb394bee7c483b540055b936d7603f0b12b980631884b0628bb10a86e
// 0x055b936d7603f0b12b980631884b0628bb10a86e
const address = tx.getSenderAddress();
const isValid = tx.verifySignature();

console.log('Public key: ', key.toString('hex'));
console.log('Address: ', address.toString('hex'));
console.log('Is Valid: ', isValid);

const txParams2 = {
	nonce: '0x01',
	gasPrice: '0x0C4B201000',
	gasLimit: '0x5208',
	to: '0x9cbfd6ebdb9cfcccd6b043f43e524583486d455e',
	from: '0x055b936d7603f0b12b980631884b0628bb10a86e',
	value: '0x0490283B23EC8F76',
	data: '0x',
};

const tx2 = new EthereumTx(txParams2, { chain: 'mainnet' });

const privateKey = Buffer.from(
	'76e48e36fdf1920c5373f14050f162f8686f408ed71a5d76429c8c38c9eb3069',
	'hex'
);

tx2.sign(privateKey);

const key2 = tx2.getSenderPublicKey();
const address2 = tx2.getSenderAddress();
const isValid2 = tx2.verifySignature();

console.log('Public key: ', key2.toString('hex'));
console.log('Address: ', address2.toString('hex'));
console.log('Is Valid: ', isValid2);
