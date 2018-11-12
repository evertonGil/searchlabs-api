var winston = require('winston');

module.exports = new winston.Logger({
	transports:[
	new winston.transports.File({
		name: 'info-searchlabs',
		level: "info",
		filename: "./app/logs/info-searchlabs",
		maxsize: 1048576,
		maxFiles: 10,
		colorize: false
	}),
	new winston.transports.File({
		name: 'errors-searchlabs',
		level: "error",
		filename: "./app/logs/errors-searchlabs",
		maxsize: 1048576,
		maxFiles: 10,
		colorize: false
	})
	]
});