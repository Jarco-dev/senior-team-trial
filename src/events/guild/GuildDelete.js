const BaseEvent = require("../../utils/structures/BaseEvent");
class GuildDeleteEvent extends BaseEvent {
    constructor() {
        super("guildDelete");
    }

    /**
     * Run the event
     * @param {Guild} guild - The guild
     */
    run(guild) {
        try {
            this.db.GuildConfigs.destroy({ where: { guildId: guild.id } });
        } catch (err) {
            this.logger.error(err);
        }
    }
}

module.exports = GuildDeleteEvent;

/**
 * @typedef {import("discord.js").Guild} Guild
 */
