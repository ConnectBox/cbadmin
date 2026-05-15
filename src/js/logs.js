/**
 * @fileoverview Log viewer page entry point for connectbox-admin-ui.
 *
 * Reads the URL hash fragment (e.g. logs.html#webserver) to determine which
 * log source to display.  'wifistatus' is handled as a special case via the
 * /admin/api/wifistatus endpoint; all other log names go to /admin/api/logs/:name.
 *
 * Valid log names are driven by the logSources map in connectbox-manage's
 * functions.js (wifistatus, webserver, loadContent, sync, connectboxmanage).
 */

import {API_URL, get} from "./api/api";

// Derive the requested log name from the URL hash and show it in the page title
// so the user knows which log they are viewing without reading the URL bar.
var logRequested = window.location.hash.substr(1);
console.log(`Getting: ${logRequested}`);
var titleElement = document.getElementById('title');
titleElement.textContent += logRequested;

var element = document.getElementById('logsArea');

/**
 * Render the log response into the logsArea div.
 *
 * The API returns an object keyed by log name whose value is the raw log text.
 * Newlines are converted to <BR> tags so the browser renders them as line
 * breaks without requiring a <pre> element, and each log section gets a
 * heading and a horizontal rule to separate multiple logs if present.
 *
 * @param {Array} data - Response array; data[0] is the keyed log object.
 */
const successCallback = (data) => {
	const logs = data[0];
	var html = '';
	// Build HTML for each log section — replace newlines with <BR> for display.
	for (var key of Object.keys(logs)) {
		console.log(key);
		html += `<h1>${key}</h1>${logs[key].replace(/\n/g,'<BR>\n')}\n<HR>\n`;
	}
	element.innerHTML = html;
}

/**
 * Show a generic error message when the log request fails.
 *
 * @param {number} status - HTTP status code from the failed request.
 */
const errorCallback = (status) => {
	element.textContent = 'Unable to Retrieve Logs'
}

// wifistatus is served directly from the /admin/api/wifistatus endpoint
// rather than the generic /logs/:name route because it is read live via
// the connectboxmanage CLI rather than from a static log file.
if (logRequested === 'wifistatus') {
    get(`${API_URL}wifistatus`, `Basic Null`, successCallback, errorCallback);
}
else {
    get(`${API_URL}logs/${logRequested}`, `Basic Null`, successCallback, errorCallback);
}
