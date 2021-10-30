const assert = require('assert');
const randomstring = require('randomstring');

const TOKEN_LENGTH = 32;

const RESIDENT_CONNECTED              = 0;
const OPERATOR_CONNECTED              = 1;
const ADDRESS_DATA_UPLOADED           = 2;
const RESIDENT_CONFIRMATION_OBTAINED  = 3;

class ResidentOperatorTransaction 
{
	constructor(resident, uid)
	{
		this.resident = resident;
		this.uid = uid; // resident aadhar number
		this.token = randomstring.generate(TOKEN_LENGTH);
		this.status = RESIDENT_CONNECTED;
	}

	connectOperator(operator)
	{
		assert.equal(this.status, RESIDENT_CONNECTED);
		this.operator = operator;
		this.status = OPERATOR_CONNECTED;
	}

	uploadAddressData(data)
	{
		assert.equal(this.status, OPERATOR_CONNECTED);
		this.addressData = data;
		this.status = ADDRESS_DATA_UPLOADED;
	}

	confirmResident()
	{
		assert.equal(this.status, ADDRESS_DATA_UPLOADED)
		this.status = RESIDENT_CONFIRMATION_OBTAINED;
	}
}

exports.ResidentOperatorTransaction = ResidentOperatorTransaction;
