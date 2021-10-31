const moment = require('moment');
const js2xml = require('js2xmlparser');
const parseXmlString = require('xml2js').parseString;

const signer = require('../../utils/signer.js');
const constants = require('../../utils/constants.js');

Object.values = Object.values || (obj => Object.keys(obj).map(key => obj[key]));
Object.isEmpty = Object.isEmpty || (obj => !(obj && Object.keys(obj).length > 0));

const OTP_XMLNS_API2_5 = 'http://www.uidai.gov.in/authentication/otp/1.0';

let API_VERSION;
let URL_HOST;
let URL_PATHTEMPLATE;

let OTP_XMLNS;
const OTP_TS_ISO8601 = 'YYYY-MM-DDTHH:mm:ss';
const TEST_AUA_CODE = 'public';
const TEST_SUBAUA_CODE = TEST_AUA_CODE;
const OTP_AUA_LICENSEKEY = constants.TEST_AUA_LICENSEKEY;
const OTP_DEFAULT_VER = () => API_VERSION;
const OTP_TYPE = {AADHAAR: 'A', MOBILE: 'M'};
const OPTS_CH = {SMS_AND_EMAIL: '00', SMS: '01', EMAIL: '02'};

const OPTS_DEFAULT_CH = OPTS_CH.SMS_AND_EMAIL;

function Otp(Opts, attrs) {
	this['@'] = Object.assign (
		{
			xmlns: OTP_XMLNS,
			uid : attrs.uid,
			ts: (moment(attrs.ts, OTP_TS_ISO8601, true).isValid()) ? attrs.ts : moment().format(OTP_TS_ISO8601),
			ac : attrs.ac ?  attrs.ac : TEST_AUA_CODE,
			sa : attrs.sa ? attrs.sa : TEST_SUBAUA_CODE,
			ver : attrs.ver ?  attrs.ver : OTP_DEFAULT_VER(),
			txn: attrs.txn,
			lk: attrs.lk ? attrs.lk : OTP_AUA_LICENSEKEY
		},
		(Object.values(OTP_TYPE).indexOf(attrs.type) > -1) && {type : attrs.type}
	);

	if(Opts) {this.Opts = Opts}
}

function Opts(attrs) {
	if(Object.values(OPTS_CH).indexOf(attrs.ch) > -1) {return;}
	this['@'] = Object.assign(
		{ch: (Object.values(OPTS_CH).indexOf(attrs.ch) > -1) ? attrs.ch : OPTS_DEFAULT_CH}
	)
}

var doOtpGeneration = function(uid, txn, callback, verConst) {

	init(verConst);
	
	let opts = new Opts({ch: OPTS_DEFAULT_CH});
	let otp = new Otp(opts, {uid: uid, ac: TEST_AUA_CODE, sa: TEST_SUBAUA_CODE, ver: OTP_DEFAULT_VER(), txn: txn, lk: OTP_AUA_LICENSEKEY, type: OTP_TYPE.AADHAAR});

	let otpXml = js2xml.parse("Otp", otp/*, {declaration: {include: false}}*/);

	signer.sign(otpXml)
	.then(function(sign) {
		makeOtpGenRequest(uid, sign, callback);
	});
}

var https = require('https');

function makeOtpGenRequest(uid, reqXml, callback) {
	var options = {
		hostname: URL_HOST,
		path: buildUrlPath(uid, URL_PATHTEMPLATE),
		method: 'POST',
		headers: {
			'Content-Type': constants.CONTENT_TYPE,
			'Content-Length': Buffer.byteLength(reqXml)
		}
	};

	var req = https.request(options, function(res){
		var buffer = '';
		res.on('data', function( data ) {
			buffer = buffer + data;
		});
		res.on('end', function( data ) {
			parseXmlString(buffer, function (err, result) {
				callback(err, result.OtpRes['$'].ret == 'y');
			});
		});
	});

	req.on('error',function(err){
		console.log(err.message);
	});


	req.write(reqXml);
	req.end();
}

function buildUrlPath(uid, pathTemplate) {
	let ver = API_VERSION;
	let ac = constants.TEST_AUTH_CODE;
	let uid0 = uid[0];
	let uid1 = uid[1];
	let asalk = constants.TEST_ASA_LICENSEKEY;

	let path = pathTemplate.replace('<ver>', ver)
	.replace('<ac>', ac)
	.replace('<uid[0]>', uid0)
	.replace('<uid[1]>', uid1)
	.replace('<asalk>', asalk)

	return path;
}

function init(verConst) {
	API_VERSION = verConst.API_VERSION;
	URL_HOST = verConst.URL_OTP_HOST;
	URL_PATHTEMPLATE = verConst.URL_OTP_PATHTEMPLATE;
	switch(API_VERSION) {
		case constants.OTP.API2_5.API_VERSION:
		OTP_XMLNS = OTP_XMLNS_API2_5;
		break;
	}
}

exports.generateOtp = function(uid, txn, callback) {
	doOtpGeneration(uid, txn, callback, constants.OTP.API2_5);
}