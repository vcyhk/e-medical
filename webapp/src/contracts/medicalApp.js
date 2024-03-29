import Web3 from 'web3';

const web3 = new Web3(window.ethereum);

const address = '0xd9A1aabDD7a0f952F10d5f4A618dac80De772555'; // Sepolia Testnet

const abi = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "patient_address",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "datetime",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "info",
				"type": "string"
			}
		],
		"name": "createMedicalRecord",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "doctor_address",
				"type": "address"
			}
		],
		"name": "regDoctorPermit",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "patient_address",
				"type": "address"
			}
		],
		"name": "getMedical",
		"outputs": [
			{
				"components": [
					{
						"components": [
							{
								"internalType": "string",
								"name": "datetime",
								"type": "string"
							},
							{
								"internalType": "string",
								"name": "info",
								"type": "string"
							}
						],
						"internalType": "struct MedicalApp.MedicalRecord[]",
						"name": "medicalRecord",
						"type": "tuple[]"
					},
					{
						"internalType": "address[]",
						"name": "DoctorPermit",
						"type": "address[]"
					}
				],
				"internalType": "struct MedicalApp.Patients",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "manager",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]

export default new web3.eth.Contract(abi, address);