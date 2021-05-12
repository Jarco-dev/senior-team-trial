const BaseCommand = require("../../utils/structures/BaseCommand");
const sequelize = require("sequelize");

class LeaderBoardCommand extends BaseCommand {
    constructor() {
        super({
            name: "leaderboard",
            aliases: ["lb"],
            description: "Check who is the highest level in the server",
            examples: ["leaderboard"],
            cooldown: 3000,
            deleteMsg: true,
            permissions: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"]
        });
    }

    /**
     * Run the command
     * @param {import("discord.js").Message} msg - The message
     */
    async run(msg) {
        const users = await this.db.Users.findAll({ order: [[sequelize.col("xp"), "DESC"]], limit: 10 });
        const lb = [];
        for (let i = 0; i < users.length; i++) {
            const { userId, xp, level } = users[i];
            if (xp > 0) lb.push(`**${i + 1}** <@${userId}> they are level **${level}** with **${xp}** experience`)
        }
        if (lb.length == 0) lb.push("There are no users with any xp yet");

        const lbEmbed = this.global.embed()
            .setTitle(`${msg.guild.name}'s leaderboard`)
            .addField("The top 10 users", lb.join("\n"));
        this.sender.send(msg, lbEmbed);
    }
}

module.exports = LeaderBoardCommand;