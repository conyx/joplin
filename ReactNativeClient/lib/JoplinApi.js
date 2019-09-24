const { Logger } = require('lib/logger.js');
const { rtrimSlashes } = require('lib/path-utils.js');

// Note that the d: namespace (the DAV namespace) is specific to Nextcloud. The RFC for example uses "D:" however
// we make all the tags and attributes lowercase so we handle both the Nextcloud style and RFC. Hopefully other
// implementations use the same namespaces. If not, extra processing can be done in `nameProcessor`, for
// example to convert a custom namespace to "d:" so that it can be used by the rest of the code.
// In general, we should only deal with things in "d:", which is the standard DAV namespace.

class JoplinApi {
	constructor(options) {
		this.logger_ = new Logger();
		this.options_ = options;
		this.sessionId_ = null;
	}

	setLogger(l) {
		this.logger_ = l;
	}

	logger() {
		return this.logger_;
	}

	baseUrl() {
		return rtrimSlashes(this.options_.baseUrl());
	}

	setSessionId(v) {
		this.sessionId_ = v;
	}

	sessionId() {
		return this.sessionId_;
	}

	requestToCurl_(url, options) {
		let output = [];
		output.push('curl');
		output.push('-v');
		if (options.method) output.push(`-X ${options.method}`);
		if (options.headers) {
			for (let n in options.headers) {
				if (!options.headers.hasOwnProperty(n)) continue;
				output.push(`${'-H ' + '"'}${n}: ${options.headers[n]}"`);
			}
		}
		if (options.body) output.push(`${'--data ' + '\''}${options.body}'`);
		output.push(url);

		return output.join(' ');
	}

	// async exec(method, path = '', body = null, headers = null, options = null) {
	// 	if (headers === null) headers = {};
	// 	if (options === null) options = {};
	// 	if (!options.responseFormat) options.responseFormat = 'json';
	// 	if (!options.target) options.target = 'string';

	// 	if (this.sessionId()) headers['X-API-AUTH'] = this.sessionId();

	// 	const fetchOptions = {};
	// 	fetchOptions.headers = headers;
	// 	fetchOptions.method = method;
	// 	if (options.path) fetchOptions.path = options.path;
	// 	if (body) fetchOptions.body = body;

	// 	const url = `${this.baseUrl()}/${path}`;

	// 	let response = null;

	// 	// console.info('Joplin API Call', method + ' ' + url, headers, options);
	// 	// console.info(this.requestToCurl_(url, fetchOptions));

	// 	if (options.source == 'file' && (method == 'POST' || method == 'PUT')) {
	// 		if (fetchOptions.path) {
	// 			const fileStat = await shim.fsDriver().stat(fetchOptions.path);
	// 			if (fileStat) fetchOptions.headers['Content-Length'] = `${fileStat.size}`;
	// 		}
	// 		response = await shim.uploadBlob(url, fetchOptions);
	// 	} else if (options.target == 'string') {
	// 		if (typeof body === 'string') fetchOptions.headers['Content-Length'] = `${shim.stringByteLength(body)}`;
	// 		response = await shim.fetch(url, fetchOptions);
	// 	} else {
	// 		// file
	// 		response = await shim.fetchBlob(url, fetchOptions);
	// 	}

	// 	const responseText = await response.text();

	// 	// console.info('WebDAV Response', responseText);

	// 	// Creates an error object with as much data as possible as it will appear in the log, which will make debugging easier
	// 	const newError = (message, code = 0) => {
	// 		// Gives a shorter response for error messages. Useful for cases where a full HTML page is accidentally loaded instead of
	// 		// JSON. That way the error message will still show there's a problem but without filling up the log or screen.
	// 		const shortResponseText = (`${responseText}`).substr(0, 1024);
	// 		return new JoplinError(`${method} ${path}: ${message} (${code}): ${shortResponseText}`, code);
	// 	};

	// 	let responseJson_ = null;
	// 	const loadResponseJson = async () => {
	// 		if (!responseText) return null;
	// 		if (responseJson_) return responseJson_;
	// 		// eslint-disable-next-line require-atomic-updates
	// 		responseJson_ = await this.xmlToJson(responseText);
	// 		if (!responseJson_) throw newError('Cannot parse XML response', response.status);
	// 		return responseJson_;
	// 	};

	// 	if (!response.ok) {
	// 		// When using fetchBlob we only get a string (not xml or json) back
	// 		if (options.target === 'file') throw newError('fetchBlob error', response.status);

	// 		let json = null;
	// 		try {
	// 			json = await loadResponseJson();
	// 		} catch (error) {
	// 			// Just send back the plain text in newErro()
	// 		}

	// 		if (json && json['d:error']) {
	// 			const code = json['d:error']['s:exception'] ? json['d:error']['s:exception'].join(' ') : response.status;
	// 			const message = json['d:error']['s:message'] ? json['d:error']['s:message'].join('\n') : 'Unknown error 1';
	// 			throw newError(`${message} (Exception ${code})`, response.status);
	// 		}

	// 		throw newError('Unknown error 2', response.status);
	// 	}

	// 	if (options.responseFormat === 'text') return responseText;

	// 	// The following methods may have a response depending on the server but it's not
	// 	// standard (some return a plain string, other XML, etc.) and we don't check the
	// 	// response anyway since we rely on the HTTP status code so return null.
	// 	if (['MKCOL', 'DELETE', 'PUT', 'MOVE'].indexOf(method) >= 0) return null;

	// 	const output = await loadResponseJson();
	// 	this.handleNginxHack_(output, newError);

	// 	// Check that we didn't get for example an HTML page (as an error) instead of the JSON response
	// 	// null responses are possible, for example for DELETE calls
	// 	if (output !== null && typeof output === 'object' && !('d:multistatus' in output)) throw newError('Not a valid WebDAV response');

	// 	return output;
	// }
}

module.exports = JoplinApi;