require('dotenv').config()

const { otpAuthenticate } = require('../auth/lib/auth/xml.js');
const { generateOtp } = require('../auth/lib/otp/xml.js');

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
})

const txn = 'dummytxn'

generateOtp(process.env.AADHAR_UID, txn, (err, res) => {
	if (res) console.log("otp generated!");
	readline.question('OTP: ', otp => {
		otpAuthenticate(process.env.AADHAR_UID, otp, txn, (err, res) => {
		if (res) console.log("authenticated!");
		else console.log("auth failed");
		process.exit();
		});		
	});
})


