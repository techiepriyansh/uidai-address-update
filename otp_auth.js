const randomstring = require('randomstring');

const { generateOtp } = require('./auth/lib/otp/xml.js');
const { otpAuthenticate } = require('./auth/lib/auth/xml.js');

class OtpAuth 
{
	constructor(uid)
	{
		this.uid = uid;
		this.txn = 'A' + randomstring.generate(15);
	}

	sendOtp(callback)
	{
		generateOtp(this.uid, this.txn, (err, res) => {
			if (res) callback();
		});
	}

	verifyOtp(otp, callback)
	{
		otpAuthenticate(this.uid, otp, this.txn, callback)
	}
}

exports.OtpAuth = OtpAuth;
