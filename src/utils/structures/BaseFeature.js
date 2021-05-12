/**
 * BaseFeature
 * The class handeling all the feature parameters
 */
class BaseFeature {
    /**
     * Constructor
     */
    constructor(name) {
        // Feature parameters
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

module.exports = BaseFeature;