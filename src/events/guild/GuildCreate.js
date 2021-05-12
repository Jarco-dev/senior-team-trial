const BaseEvent = require("../../utils/structures/BaseEvent");

class GuildCreateEvent extends BaseEvent {
    constructor() {
        super("guildCreate");
    }

    /**
     * Run the event
     * @param {Guild} guild - The guild
     */
    run(guild) {
        try {
            this.db.GuildConfigs.create({ guildId: guild.id, prefix: this.config.prefix });
        } catch (err) {
            this.logger.error(err);
        }
    }
}

module.exports = GuildCreateEvent;

/**
 * @typedef {import("discord.js").Guild} Guild
 */