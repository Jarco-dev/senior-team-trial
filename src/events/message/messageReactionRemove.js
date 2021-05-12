const BaseEvent = require("../../utils/structures/BaseEvent");

class MessageReactionRemoveEvent extends BaseEvent {
    constructor() {
        super("messageReactionRemove");
    }

    /**
     * Run the event
     * @param {MessageReaction} reaction - The message reaction
     * @param {User} user - The user reaction
     */
    run(reaction, user) {
        this.ReactionCollector.react(reaction.message, reaction.emoji.name, user.id, "remove");
    }
}

module.exports = MessageReactionRemoveEvent;

/**
 * @typedef {import("discord.js").User} User
 * @typedef {import("discord.js").MessageReaction} MessageReaction
 */