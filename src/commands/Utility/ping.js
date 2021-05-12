const BaseCommand = require("../../utils/structures/BaseCommand");

class PingCommand extends BaseCommand {
    constructor() {
        super({
            name: "ping",
            description: "Show the bots latency with the api and it's actualy response time",
            args: "[explain]",
            examples: ["ping", "ping explain"],
            cooldown: 3000,
            deleteMsg: true,
            permissions: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"]
        });

        this.repeatEmoji = this.config.emoji.repeat;
        this.heartEmoji = this.config.emoji.heartbeat;
    }

    /**
     * Run the command
     * @param {import("discord.js").Message} msg - The message 
     */
    async run(msg) {
        // Show latencies
        if (!msg.args[0]) {
            const pingingEmbed = this.global.embed()
                .setTitle("Pinging...");
            const reply = await this.sender.send(msg, pingingEmbed);

            const timeDiff = reply.createdTimestamp - msg.createdTimestamp
            const resultEmbed = this.global.embed()
                .setTitle("Ping result")
                .setDescription(`${this.repeatEmoji} **RTT**: ${timeDiff}ms\n${this.heartEmoji} **Heartbeat**: ${Math.round(this.client.ws.ping)}ms`);
            reply.edit(resultEmbed);
        }

        // Explain latencies
        else if (msg.args[0] == "explain") {
            const explainEmbed = this.global.embed()
                .setTitle("Ping explenation")
                .setDescription(`${this.repeatEmoji} **RTT**: The time between you sending the message and the bot replying\n${this.heartEmoji} **Heartbeat**: The delay between the bot and the discord api servers`);
            this.sender.send(msg, explainEmbed);
        }

        // Invalid argument
        else {
            this.sender.invalid(msg, "This is a invalid argument, did you mean `explain`?", 5000);
        }
    }
}

module.exports = PingCommand;