const BaseCommand = require("../../utils/structures/BaseCommand");

class XpCommand extends BaseCommand {
    constructor() {
        super({
            name: "xp",
            description: "Lookup how much xp a user has",
            args: "[user]",
            examples: ["xp", "xp @user", "xp 232163746829697025"],
            cooldown: 3000,
            disableDm: true,
            deleteMsg: true,
            permissions: ["VIEW_CHANNEL", "SEND_MESSAGES"]
        });
    }

    /**
     * Run the command
     * @param {import("discord.js").Message} msg - The message
     */
    async run(msg) {
        // User argument
        if (msg.args[0]) {
            const user = await this.global.fetchUser((msg.args[0]) ? msg.args[0] : undefined);
            if (!user) return this.sender.invalid(msg, "Please provide a (valid) user mention or ID");

            try {
                const userData = await this.db.Users.findOne({ where: { userId: user.id } });
                if (userData) {
                    this.sender.send(msg, `**${user.username}** has a total of **${userData.xp}** experience points`);
                } else {
                    this.sender.invalid(msg, "This user hasn't received any xp yet");
                }
            } catch (err) {
                this.logger.error(err);
                this.sender.error(msg, "Something went wrong while getting this users xp, please try again", 5000);
            }
        } else {
            try {
                const userData = await this.db.Users.findOne({ where: { userId: msg.author.id } });
                if (userData) {
                    this.sender.send(msg, `You have a total of **${userData.xp}** experience points`);
                } else {
                    this.sender.invalid(msg, "You haven't received any xp yet");
                }
            } catch (err) {
                this.logger.error(err);
                this.sender.error(msg, "Something went wrong while getting this users xp, please try again", 5000);
            }
        }
    }
}

module.exports = XpCommand;