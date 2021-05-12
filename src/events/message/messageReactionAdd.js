const BaseEvent = require("../../utils/structures/BaseEvent");

class MessageReactionAddEvent extends BaseEvent {
    constructor() {
        super("messageReactionAdd");
    }

    /**
     * Run the event
     * @param {MessageReaction} reaction - The message reaction
     * @param {User} user - The user
     */
    run(reaction, user) {
        this.ReactionCollector.react(reaction.message, reaction.emoji.name, user.id, "add");
    }
}

module.exports = MessageReactionAddEvent;

/**
 * @typedef {import("discord.js").User} User
 * @typedef {import("discord.js").MessageReaction} MessageReaction
 */