const BaseFeature = require("../../utils/structures/BaseFeature");

/**
 * PresenceFeature
 * Manages the bots presence
 */
class PresenceFeature extends BaseFeature {
    constructor() {
        super("presence");

        this.interval;
    }

    /**
     * Start the feature
     */
    start() {
        this._update();
        this.interval = setInterval(() => this._update(), 30000);
    }

    /**
     * Update the bots presence
     * @private
     */
    async _update() {
        const members = await this.client.guilds.cache.reduce((amount, guild) => amount + guild.memberCount, 0);
        this.client.user.setPresence({
            status: "online",
            activity: {
                name: `${members} users`,
                type: "LISTENING"
            }
        });
    }
}

module.exports = PresenceFeature;