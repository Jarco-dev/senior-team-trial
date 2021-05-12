const moment = require("moment");

/**
 * Logger
 * The class for handeling all the logs the bot throws at it
 */
class Logger {
    /**
     * Set the log level upon creation
     * @param {String|Number} level - The level of logs at wich you want to start logging 
     */
    constructor(level) {
        /** @private */
        this.level;

        this._setLogLevel(level);
    }

    /**
     * Log the verbose message
     * @param {String} message - The verbose message 
     */
    verbose(message) {
        if (this.level <= 0) {
            console.log(`[${this._getDateTimeString()}] [VERBOSE]`, message);
        }
    }

    /**
     * Log a debug message
     * @param {String} message - The debug message 
     */
    debug(message) {
        if (this.level <= 1) {
            console.log("\x1b[36m%s\x1b[0m", `[${this._getDateTimeString()}] [DEBUG]`, message);
        }
    }

    /**
     * Log the info message
     * @param {String} message - The info message 
     */
    info(message) {
        if (this.level <= 2) {
            console.log("\x1b[32m%s\x1b[0m", `[${this._getDateTimeString()}] [INFO]`, message);
        }
    }

    /**
     * Log a warn message
     * @param {String} message - The warning message 
     */
    warn(message) {
        if (this.level <= 3) {
            console.warn("\x1b[33m%s\x1b[0m", `[${this._getDateTimeString()}] [WARN]`, message)
        }
    }

    /**
     * Log an error message
     * @param {String} message - The error message
     * @param {String} error - The cougth error
     */
    error(message, error) {
        if (this.level <= 4) {
            console.error("\x1b[31m%s\x1b[0m", `[${this._getDateTimeString()}] [ERROR]`, message, error);
        }
    }

    /**
     * Get the current date and time in the YYYY-MM-DD HH:mm:ss format
     * @returns {String}
     * @private
     */
    _getDateTimeString() {
        return moment.utc().format("YYYY-MM-DD HH:mm:ss");
    }

    /**
     * Set the logging level
     * @param {String|Number} level - The level of logs at wich you want to start logging
     * @private
     */
    _setLogLevel(level) {
        switch (level) {
            case "verbose":
            case 0:
                this.level = 0;
                break;

            case "debug":
            case 1:
                this.level = 1;
                break;

            case "info":
            case 2:
                this.level = 2;
                break;

            case "warn":
            case 3:
                this.level = 3;
                break;

            case "error":
            case 4:
                this.level = 4;
                break;

            default:
                throw new Error(`level is a invalid log level`);
        }
    }
}

module.exports = Logger;