/**
 * BaseCommand
 * The class handeling all the command parameters
 */
class BaseCommand {
    /**
     * Constructor
     * @param {Object} p - The parameters for the command
     * @param {String} p.name - Name of the command
     * @param {String[]} [p.aliases=[]] - Aliases
     * @param {String} p.description - A small description of the use
     * @param {String} [p.args=""] - The argument syntax
     * @param {String[]} [p.examples=[]] - Examples on how to use it
     * @param {Number} [p.cooldown=3000] - How long a user has to wait before using it again
     * @param {Boolean} [p.nsfw=false] - Should it be locked to nsfw channels?
     * @param {Boolean} [p.disableDm=false] - Should it be usable in dms?
     * @param {Boolean} [p.deleteMsg=false] - Should the message be deleted on execution?
     * @param {PermissionFlags[]} [p.permissions=[]] - The permissions the bot needs to execute it
     */
    constructor({ name, aliases, description, args, examples, cooldown, nsfw, disableDm, deleteMsg, permissions }) {
        // Command parameters
        this.name = name;
        this.aliases = aliases || [];
        this.description = description;
        this.args = args || "";
        this.examples = examples || [];
        this.cooldown = cooldown || 0;
        this.nsfw = nsfw || false;
        this.disableDm = disableDm || false;
        this.deleteMsg = deleteMsg || false;
        this.permissions = permissions || [];

        // Client parameters
        this.client = require("../../Bot");
        this.db = this.client.db;
        this.config = this.client.config;
        this.version = this.client.version;
        this.logger = this.client.logger;
        this.global = this.client.global;
        this.sender = this.client.sender;
        this.ReactionCollector = this.client.reactionCollector;
    }
}

module.exports = BaseCommand;