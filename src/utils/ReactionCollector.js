const EventEmitter = require("events");

/**
 * ReactionCollector
 * A custom ReactionCollector listening to the reaction add and remove events
 */
class ReactionCollector {
    /**
     * Constructor
     * @param {Client} [client] - The client instance
     */
    constructor(client) {
        /** @private */
        this.client = client;

        /** @private */
        this.listeners = {};
    }

    /**
     * Create a ReactionCollector
     * @param {Message} msg - The message to listen for reactions on
     * @param {Function} filter - The filter to apply to the ReactionCollector
     * @param {Object} [options] - The options to apply to the ReactionCollector
     * @param {Number} [options.time=null] - The maximum time active before ending in milliseconds
     * @param {Number} [options.idle=null] - The maximum time inactive before ending in milliseconds
     * @param {Boolean} [options.editMsgOnEnd=true] - Should the message be edited when it's no longer active?
     */
    async create(msg, filter, options = {}) {
        delete this.listeners[msg.id];
        let ree = new ReactionEventEmitter(filter, options);
        ree.on("end", () => {
            delete this.listeners[msg.id];
            if ((options.editMsgOnEnd || options.editMsgOnEnd == undefined) && !msg.deleted) {
                msg.edit("This message is now inactive").catch(err => { });
            }
        });
        this.listeners[msg.id] = ree;

        return ree;
    }

    /**
     * Process a reaction event
     * @param {Message} msg - The message the reaction event was emitted on 
     * @param {ReactionEmoji} emoji - The reaction emoji
     * @param {Snowflake} userId - The id of the user who triggered the event
     * @param {String} type - The type of the event
     */
    react(msg, emoji, userId, type) {
        if (!this.listeners[msg.id]) return;
        this.listeners[msg.id].collect(emoji, userId, type);
    }

}

/**
 * ReactionEventEmitter
 * Handle and emit reaction events
 */
class ReactionEventEmitter extends EventEmitter {
    /**
     * Constructor
     * @param {Function} filter - The filter to apply to the ReactionEventEmitter
     * @param {Object} [options] - The options to apply to the ReactionEventEmitter
     * @param {Number} [options.time=null] - The maximum time active before ending in milliseconds
     * @param {Number} [options.idle=null] - The maximum time inactive before ending in milliseconds
     */
    constructor(filter, { time = null, idle = null }) {
        super();

        /** @private */
        this.filter = filter;

        /** @private */
        this.ended = false;

        /** @private */
        this.idleTimeout = idle;

        if (time) this.time = setTimeout(() => this.stop("time"), time);
        if (idle) this.idle = setTimeout(() => this.stop("idle"), idle);
    }

    /**
     * Check wether the filter passes or not
     * @param {ReactionEmoji} emoji - The emoji
     * @param {Snowflake} userId - The reaction userId
     * @returns {Boolean}
     */
    checkFilter(emoji, userId) {
        if (!this.filter) return true;
        return this.filter(emoji, userId);
    }

    /**
     * Handle a reaction being added or removed
     * @param {ReactionEmoji} emoji - The emoji
     * @param {Snowflake} userId - The reaction userId
     * @param {String} [type] - The add or remove reaction type
     */
    collect(emoji, userId, type) {
        if (!this.checkFilter(emoji, userId)) return;
        if (this.ended) return;

        this.emit("collect", emoji, userId, type);

        if (this.idleTimeout) {
            clearTimeout(this.idle);
            this.idle = setTimeout(() => this.stop("idle"), this.idleTimeout);
        }
    }

    /**
     * Stop the ReactionEventEmitter
     * @param {String} [reason=""] - The reason for stopping
     */
    stop(reason) {
        if (this.ended) return;
        this.ended = true;

        if (this.time) {
            clearTimeout(this.time);
            this.time = null;
        }

        if (this.idle) {
            clearTimeout(this.idle);
            this.idle = null;
        }

        this.emit("end", reason);
        this.removeAllListeners();
    }
}

module.exports = ReactionCollector;

/**
 * @typedef {import("../Bot")} Client
 * @typedef {import("discord.js").Message} Message
 * @typedef {import("discord.js").Snowflake} Snowflake
 * @typedef {import("discord.js").ReactionEmoji} ReactionEmoji
 * @typedef {import("discord.js").EmojiIdentifierResolvable} EmojiIdentifierResolvable
 */