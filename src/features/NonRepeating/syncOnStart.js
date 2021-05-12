const BaseFeature = require("../../utils/structures/BaseFeature");

/**
 * SyncOnStartUpFeature
 * Sync the database with the created and deleted guilds on startup
 */
class SyncOnStartFeature extends BaseFeature {
    constructor() {
        super("syncOnStart");
    }

    /**
     * Run the feature
     */
    async start() {
        const dbGuildIds = [];
        const cachedGuildIds = [];

        // Get all the guilds from the cache and db
        await this.client.guilds.cache.forEach(guild => cachedGuildIds.push(guild.id));
        const dbGuilds = await this.db.GuildConfigs.findAll();
        await dbGuilds.forEach(dbGuild => dbGuildIds.push(dbGuild.guildId));

        // Remove the guilds the bot is no longer in
        dbGuildIds.forEach(dbGuildId => {
            if (!cachedGuildIds.includes(dbGuildId)) {
                this.db.GuildConfigs.destroy({ where: { guildId: dbGuildId } })
                    .catch(err => this.logger.error(err));
            }
        });

        // Add the guilds the bot has been added to
        cachedGuildIds.forEach(async cachedGuildId => {
            if (!dbGuildIds.includes(cachedGuildId)) {
                this.db.GuildConfigs.create({ guildId: cachedGuildId, prefix: this.config.prefix })
                    .catch(err => this.logger.error(err));
            }
        });
    }
}

module.exports = SyncOnStartFeature;