/**
 * BaseEvent
 * The class handeling all the event parameters
 */
class BaseEvent {
    /**
     * Constructor
     * @param {String} name - Name of the event
     */
    constructor(name) {
        // Event parameters
        this.name = name;

        // Client parameters
        this.client = require("../../Bot");
        this.db = this.client.db;
        this.config = this.client.config;
        this.version = this.client.version;
        this.logger = this.client.logger;
        this.global = this.client.global;
        this.sender = this.client.sender;
        this.ReactionCollector = this.client.reactionCollector;
    }
}

module.exports = BaseEvent;