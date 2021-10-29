const { WebSocketServer } = require('ws');
require('dotenv').config()

const { ResidentOperatorTransaction } = require('./resident_operator_transaction.js');
const { splitMessage, MSG_DELIM } = require('./utils.js');

const wss = new WebSocketServer({ 
	port: process.env.SOCKET_PORT, 
});

let transactions = {};

wss.on('connection', client => {
	client.on('message', msg => {
		let [cmd, arg] = splitMessage(msg);

		switch (cmd) {
			case 'new_resident': { 
				let uid = arg; // Aadhaar number
				let transaction = new ResidentOperatorTransaction(client, uid);
				transactions[transaction.token] = transaction;
				client.send(`token${MSG_DELIM}${token}`);
				break;
			}

			case 'new_operator': {
				let token = arg;
				transactions[token].connectOperator(client);
				client.send(`new_operator${MSG_DELIM}true`);
				break;
			}

			default: {
				let token = cmd;
				let transaction = transactions[token];

				let [remCmd, remArg] = arg;
				switch (remCmd) {
					case 'authenticate_resident': {
						assert.deepEqual(transaction.operator, client);
						let authenticated = transaction.authenticateResident(remArg);
						client.send(`authenticate_resident${MSG_DELIM}${authenticated}`);
						if (!authenticated) delete transactions[token];
						break;
					}

					case 'upload_address_data': {
						assert.deepEqual(transaction.operator, client);
						transaction.uploadAddressData(remArg);
						client.send(`upload_address_data${MSG_DELIM}true`);
						transaction.resident.send(`address_data${MSG_DELIM}${remData}`)
						break;
					}

					case 'confirm_resident': {
						assert.deepEqual(transaction.resident, client);
						transaction.confirmResident();
						// push the transaction address data to the relevant db
						client.send(`done${MSG_DELIM}true`);
						delete transactions[token];
						break;
					}
				}
			}
		}
	})
})
