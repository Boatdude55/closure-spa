{
	"id": "spa",
	"paths": "app/js",
	"inputs": [
		"google/closure-templates/javascript/soyutils_usegoog.js",
		"app/js/bootstrap.js"
	],
	"externs": [
		"firebase-js-sdk/packages/firebase/externs/firebase-externs.js",
		"firebase-js-sdk/packages/firebase/externs/firebase-error-externs.js",
		"firebase-js-sdk/packages/firebase/externs/firebase-app-internal-externs.js",
		"firebase-js-sdk/packages/firebase/externs/firebase-app-externs.js",
		"firebase-js-sdk/packages/firebase/externs/firebase-error-externs.js",
		"firebase-js-sdk/packages/firebase/externs/firebase-auth-externs.js",
		"externs/plaid.js"
	],
	"closure-library": "google/closure-library/closure/goog",
	"mode": "ADVANCED",
	"level": "VERBOSE",
	"pretty-print": false,
	"debug": false,
	"output-file": "app/jsc/app.min.js",
	"jsdoc-html-output-path": "app/jsc/readme.html",
	"checks": {
		"visibility": "ERROR",
		"checkRegExp": "ERROR",
		"checkTypes": "ERROR",
		"checkVars": "ERROR",
		"deprecated": "OFF",
		"fileoverviewTags": "ERROR",
		"invalidCasts": "ERROR",
		"missingProperties": "ERROR",
		"nonStandardJsDocs": "ERROR",
		"undefinedVars": "ERROR"
	},
	"experimental-compiler-options": {
		"instrumentForCoverage": true
	}
}
