const Discord = require("discord.js");

/**
 * Sender
 * The class that handles sending messages
 */
class Sender {
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
        this.successEmoji = this.client.config.emoji.success;

        /** @private */
        this.invalidEmoji = this.client.config.emoji.invalid;

        /** @private */
        this.errorEmoji = this.client.config.emoji.error;
    }

    /**
     * Send a message to the msg channel
     * @param {Message} msg - The command message
     * @param {String} content - The content you want to send
     * @param {Number} [del] - The delay before deleting the message in milliseconds
     * @returns {Promise<Message>}
     */
    send(msg, content, del) {
        let maxLength = 2000;

        if (typeof content === "string" && content.length >= maxLength) {
            return msg.channel.send(`${this.errorEmoji}  **|** Error, the message is too long to send`);
        } else {
            if (del && del > 0) {
                return msg.channel.send(content)
                    .then(message => setTimeout(() => {
                        message.delete().catch();
                    }, del));
            } else {
                return msg.channel.send(content);
            }
        }
    }

    /**
     * Reply to a message
     * @param {Message} msg - The command message
     * @param {EmojiResolvable} emoji - The emoji to use in the reply
     * @param {String} content - The content you want to send
     * @param {Number} [del] - The delay before deleting the message in milliseconds
     * @returns {Promise<Message>}
     */
    reply(msg, emoji, content, del) {
        let maxLength = 2000;
        let username = msg.author.username;

        if (typeof content === "string" && content.length >= maxLength) {
            return msg.channel.send(`${this.errorEmoji}  **|** Error, the message is too long to send`);
        } else {
            if (del && del > 0) {
                return msg.channel.send(`**${emoji}  | ${username}**, ${content}`)
                    .then(message => setTimeout(() => {
                        message.delete().catch();
                    }, del));
            } else {
                return msg.channel.send(`**${emoji}  | ${username}**, ${content}`);
            }
        }
    }

    /**
     * Reply to a message
     * @param {Message} msg - The command message
     * @param {String} content - The content you want to send
     * @param {Number} [del] - The delay before deleting the message in milliseconds
     * @returns {Promise<Message>}
     */
    success(msg, content, del) {
        let maxLength = 2000;

        if (typeof content === "string" && content.length >= maxLength) {
            return msg.channel.send(`${this.errorEmoji}  **|** Error, the message is too long to send`);
        } else {
            if (del && del > 0) {
                return msg.channel.send(`${this.successEmoji}  **|** ${content}`)
                    .then(message => setTimeout(() => {
                        message.delete().catch();
                    }, del));
            } else {
                return msg.channel.send(`${this.successEmoji}  **|** ${content}`);
            }
        }
    }

    /**
     * Reply to a message
     * @param {Message} msg - The command message
     * @param {String} content - The content you want to send
     * @param {Number} [del] - The delay before deleting the message in milliseconds
     * @returns {Promise<Message>}
     */
    invalid(msg, content, del) {
        let maxLength = 2000;

        if (typeof content === "string" && content.length >= maxLength) {
            return msg.channel.send(`${this.errorEmoji}  **|** Error, the message is too long to send`);
        } else {
            if (del && del > 0) {
                return msg.channel.send(`${this.invalidEmoji}  **|** ${content}`)
                    .then(message => setTimeout(() => {
                        message.delete().catch();
                    }, del));
            } else {
                return msg.channel.send(`${this.invalidEmoji}  **|** ${content}`);
            }
        }
    }

    /**
     * Reply to a message
     * @param {Message} msg - The command message
     * @param {String} content - The content you want to send
     * @param {Number} [del] - The delay before deleting the message in milliseconds
     * @returns {Promise<Message>}
     */
    error(msg, content, del) {
        let maxLength = 2000;

        if (typeof content === "string" && content.length >= maxLength) {
            return msg.channel.send(`${this.errorEmoji}  **|** Error, the message is too long to send`);
        } else {
            if (del && del > 0) {
                return msg.channel.send(`${this.errorEmoji}  **|** ${content}`)
                    .then(message => setTimeout(() => {
                        message.delete().catch();
                    }, del));
            } else {
                return msg.channel.send(`${this.errorEmoji}  **|** ${content}`);
            }
        }
    }

    /**
     * Send a message in a channel
     * @param {TextChannel|DMChannel|NewsChannel|Snowflake} channel - The channel to send the message in
     * @param {String} content - The content you want to send
     * @param {Object} [options] - The channel message options
     * @param {EmojiIdentifierResolvable[]} [options.react] - The emoji(s) that should be added as reactions
     * @returns {Promise<Message>}
     */
    async msgChannel(channel, content, options) {
        if (!(channel instanceof Discord.Channel)) {
            try {
                const id = channel.match(/[0-9]+/)[0];
                if (id) channel = this.client.channels.resolve(id);
            } catch (err) {
                return;
            }
        }

        if (channel) {
            const message = await channel.send(content);

            // Add reactions if there is any
            if (options && options.react) {
                for (let i in options.react) {
                    await message.react(options.react[i]);
                }
            }
            return message;
        } else {
            return;
        }
    }


    /**
     * Reply to a message
     * @param {User|Snowflake} user - The user you want to dm
     * @param {String} content - The content you want to send
     * @returns {Promise<Message>}
     */
    async msgUser(user, content) {
        if (!(user instanceof Discord.User)) {
            try {
                const id = user.match(/[0-9]+/);
                if (id) user = await this.client.users.fetch(id);
            } catch (err) {
                return;
            }
        }

        if (user) {
            try {
                return user.send(content);
            } catch (err) {
                return;
            }
        } else {
            return;
        }
    }

}

module.exports = Sender;

/**
 * @typedef {import("../Bot")} Client
 * @typedef {import("discord.js").User} User
 * @typedef {import("discord.js").Message} Message
 * @typedef {import("discord.js").DMChannel} DMChannel
 * @typedef {import("discord.js").Snowflake} Snowflake
 * @typedef {import("discord.js").TextChannel} TextChannel
 * @typedef {import("discord.js").NewsChannel} NewsChannel
 * @typedef {import("discord.js").EmojiResolvable} EmojiResolvable
 * @typedef {import("discord.js").EmojiIdentifierResolvable} EmojiIdentifierResolvable
 */