// https://<host>/<ver>/<ac>/<uid[0]>/<uid[1]>/<asalk>
exports.CONTENT_TYPE = 'application/xml';
exports.TEST_AUA_LICENSEKEY = 'MAElpSz56NccNf11_wSM_RrXwa7n8_CaoWRrjYYWouA1r8IoJjuaGYg';
exports.TEST_ASA_LICENSEKEY = 'MEY2cG1nhC02dzj6hnqyKN2A1u6U0LcLAYaPBaLI-3qE-FtthtweGuk';
exports.TEST_AUTH_CODE = 'public';
exports.TEST_SUBAUA_CODE = 'public';
exports.UIDAI_STAGE_CERT = require('path').join(__dirname, '..', 'res', 'uidai_auth_stage.cer');
exports.STAGING_PRIVKEY_P12 = require('path').join(__dirname, '..', 'res', 'Staging_Signature_PrivateKey.p12');

exports.AUTH = {
	API2_5: {
		API_VERSION: '2.5',
		URL_AUTH_HOST: 'authserver-stage.uidai.gov.in', 
		URL_AUTH_PATHTEMPLATE: '/uidauthserver/<ver>/<ac>/<uid[0]>/<uid[1]>/<asalk>'//'<ver>/<ac>/<uid[0]>/<uid[1]>/<asalk>'
	}
}

exports.OTP = {
	API2_5: {
		API_VERSION: '2.5',
		URL_OTP_HOST: 'otp-stage.uidai.gov.in',
		URL_OTP_PATHTEMPLATE: '/uidotpserver/<ver>/<ac>/<uid[0]>/<uid[1]>/<asalk>'
	}
}
