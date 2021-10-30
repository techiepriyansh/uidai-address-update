const { WebSocketServer } = require('ws');
require('dotenv').config()

const assert = require('assert');

const { OtpAuth } = require('./otp_auth.js');
const { ResidentOperatorTransaction } = require('./resident_operator_transaction.js');
const { splitMessage, MSG_DELIM } = require('./utils.js');

const wss = new WebSocketServer({ 
	port: process.env.SOCKET_PORT, 
});

let auths = {}
let transactions = {};

wss.on('connection', client => {
	client.on('message', rawMsg => {
		let msg = rawMsg.toString();
		console.log(msg)
		let [cmd, arg] = splitMessage(msg);

		switch (cmd) {
			case 'new_resident': { 
				let uid = arg; // Aadhaar number
				let auth = new OtpAuth(uid);
				auths[auth.txn] = auth;
				auth.sendOtp(() => {
					client.send(`txn${MSG_DELIM}${auth.txn}`);
				});
				break;
			}

			case 'auth_otp_resident': {
				let [txn, otp] = splitMessage(arg);
				let auth = auths[txn];
				auth.verifyOtp(otp, (err, res) => {
					if (res) {
						let transaction = new ResidentOperatorTransaction(client, auth.uid);
						transactions[transaction.token] = transaction;
						client.send(`token${MSG_DELIM}${transaction.token}`);
					} else {
						client.send(`error${MSG_DELIM}authentication`);
					}
				})
				break;
			}

			case 'new_operator': {
				let [token, operatorSecret] = splitMessage(arg);
				// TODO: verify(operatorSecret)
				transactions[token].connectOperator(client);
				client.send(`new_operator${MSG_DELIM}true`);
				break;
			}

			default: {
				let token = cmd;
				let transaction = transactions[token];

				let [remCmd, remArg] = splitMessage(arg);
				switch (remCmd) {
					case 'upload_address_data': {
						assert.deepEqual(transaction.operator, client);
						transaction.uploadAddressData(remArg);
						client.send(`upload_address_data${MSG_DELIM}true`);
						transaction.resident.send(`address_data${MSG_DELIM}${remArg}`)
						break;
					}

					case 'confirm_resident': {
						assert.deepEqual(transaction.resident, client);
						transaction.confirmResident();
						// push the transaction address data to the relevant db
						console.log(transaction.addressData);
						client.send(`done${MSG_DELIM}true`);
						delete transactions[token];
						break;
					}
				}
			}
		}
	})
})
