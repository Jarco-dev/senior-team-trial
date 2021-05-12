/**
 * Global
 * Global functions for use in the bot
 */
class Levels {
    /**
     * Constructor
     * @param {Client} client - The client instance
     */
    constructor(client) {
        /** @private */
        this.client = client;

        /** @private */
        this.logger = client.logger;

        /** @private */
        this.config = client.config;

        /** @private */
        this.sender = client.sender;

        /** @private */
        this.global = client.global;

        /** @private */
        this.db = client.db;

        /** @private */
        this.cooldown = {};
    }

    /**
     * Add xp to a user if they aren't on cooldown
     * @param {Message} msg - The message
     */
    async addXp(msg) {
        const userId = msg.author.id;
        if (!this.cooldown[userId]) {
            this.cooldown[userId] = true;
            setTimeout(() => delete this.cooldown[userId], 10000);

            const amount = Math.round(Math.random() * 4) + 1;
            const userData = await this.db.Users.findOne({ where: { userId: userId } });
            if (userData) {
                if (userData.xp + amount > this._calcXpForLevel(userData.level + 1)) {
                    this.db.Users.increment({ xp: +amount, level: +1 }, { where: { userId: userId } });
                    await msg.guild.me.fetch();
                    const perms = await msg.guild.me.permissionsIn(msg.channel);
                    if (perms.has("VIEW_CHANNEL") && perms.has("SEND_MESSAGES") && perms.has("EMBED_LINKS")) {
                        this.sender.send(msg, this.global.embed().setTitle(`Congratulations ${msg.author.username} you just leveled up to level ${userData.level + 1}!`), 10000);
                    }
                } else {
                    this.db.Users.increment({ xp: +amount }, { where: { userId: userId } });
                }
            } else {
                this.db.Users.create({ userId: userId, xp: amount });
            }
        }
    }

    /**
     * Calculate how much xp is needed for a level
     * @param {Number} level - The level to calculate the xp for 
     * @returns {Number}
     * @private
     */
    _calcXpForLevel(level) {
        return Math.pow(2, level) * 25;
    }
}

module.exports = Levels;

/**
 * @typedef {import("../Bot")} Client
 * @typedef {import("discord.js").Message} Message
 */