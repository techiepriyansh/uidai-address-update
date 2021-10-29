const randomstring = require('randomstring');

const TOKEN_LENGTH = 32;

const RESIDENT_CONNECTED             = 0;
const OPERATOR_CONNECTED             = 1;
const RESIDENT_AUTHENTICATED         = 2;
const ADDRESS_DATA_UPLOADED          = 3;
const RESIDENT_CONFIRMATION_OBTAINED = 4;

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

	authenticateResident(authData)
	{
		assert.equal(this.status, OPERATOR_CONNECTED);
		// TODO: Aadhar API Authenticate
		this.status = RESIDENT_AUTHENTICATED;
		return true;
	}

	uploadAddressData(data)
	{
		assert.equal(this.status, RESIDENT_AUTHENTICATED);
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
