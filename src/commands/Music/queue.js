const BaseCommand = require("../../utils/structures/BaseCommand");

class QueueCommand extends BaseCommand {
    constructor() {
        super({
            name: "queue",
            description: "Check out what songs are comming up in the queue",
            examples: ["queue"],
            cooldown: 3000,
            disableDm: true,
            deleteMsg: true,
            permissions: ["VIEW_CHANNEL", "READ_MESSAGE_HISTORY", "SEND_MESSAGES", "EMBED_LINKS", "ADD_REACTIONS"]
        });

        /** @private */
        this.nextEmoji = this.config.emoji.next;

        /** @private */
        this.backEmoji = this.config.emoji.back;
    }

    /**
     * Run the command
     * @param {Message} msg - The message
     */
    async run(msg) {
        // There is a queue
        if (!msg.guild.queue) return this.sender.invalid(msg, "There is currently no active queue", 5000);

        // Single page queue embed
        if (msg.guild.queue.songs.length <= 11) {
            this.sender.send(msg, this._getEmbed(msg.guild, 1));
            return;
        }

        // Multi page queue embed
        const reply = await this.sender.msgChannel(msg.channel, this._getEmbed(msg.guild, 1), { react: [this.backEmoji, this.nextEmoji] });
        const filter = (emoji, userId) => [this.backEmoji, this.nextEmoji].includes(emoji) && msg.author.id == userId;
        const collector = await this.ReactionCollector.create(reply, filter, { time: 300000, idle: 30000, editMsgOnEnd: true });

        let page = 1;
        const maxPage = Math.ceil((msg.guild.queue.songs.length - 1) / 10);
        collector.on("collect", (emoji, userId) => {
            switch (emoji) {
                case this.nextEmoji: {
                    if (page + 1 > maxPage) page = 1;
                    else page++;
                    reply.edit(this._getEmbed(msg.guild, page)).catch(err => { });
                    break;
                }

                case this.backEmoji: {
                    if (page - 1 < 1) page = maxPage;
                    else page--;
                    reply.edit(this._getEmbed(msg.guild, page)).catch(err => { });
                    break;
                }
            }
        });
    }

    /**
     * Get a certain page of the queue
     * @param {Guild} guild - The message guild 
     * @param {Number} page - The wanted page
     * @returns {MessageEmbed}
     */
    _getEmbed(guild, page) {
        const queue = [];
        const startIndex = (page - 1) * 10;
        const maxPage = Math.ceil((guild.queue.songs.length) / 10);
        for (let i = startIndex; queue.length < 11 && i < guild.queue.songs.length; i++) {
            if (queue.length == 0) queue.push(`**Playing )**  ${guild.queue.songs[0].title}\n`);
            else queue.push(`**${queue.length + startIndex} )** ${guild.queue.songs[i].title}`);
        }
        return this.global.embed()
            .setTitle(`${guild.name}'s queue | ${page}/${maxPage}`)
            .setDescription(queue.join("\n"));
    }
}

module.exports = QueueCommand;

/**
 * @typedef {import("discord.js").Guild} Guild
 * @typedef {import("discord.js").Message} Message
 * @typedef {import("discord.js").MessageEmbed} MessageEmbed
 */