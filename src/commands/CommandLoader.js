const BaseCommand = require("../utils/structures/BaseCommand");
const fs = require("fs").promises;
const path = require("path");

/**
 * CommandLoader
 * The class for loading and unloading commands
 */
class CommandLoader {
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

        /**
         * All the currenty loaded commands
         */
        this.commands = {};
        this.commandAliases = {};
        this.categories = {};

        /**
         * The path to the commands folder
         */
        this.path = "./src/commands/"
    }

    /**
     * Load all the commands that are available
     */
    async loadAll() {
        // Get all the categories
        const categories = await fs.readdir(this.path);
        for (const category of categories) {
            // Load the commands if it's a folder
            if ((await fs.lstat(this.path + category)).isDirectory()) {
                this.categories[category] = [];
                const files = await fs.readdir(this.path + category);
                // Go through all the command files
                for (const file of files) {
                    if (file.endsWith(".js")) {
                        const Command = require(path.join(__dirname, `${category}/${file}`));
                        if (Command.prototype instanceof BaseCommand) {
                            try {
                                const command = new Command();
                                this.commands[command.name] = command;
                                this.categories[category].push(command.name);
                                command.aliases.forEach(alias => this.commandAliases[alias] = command.name);
                            }
                            catch (err) {
                                this.logger.error(err);
                                // this.logger.error(`Error while loading command: ${Command.name}\n${err}`);
                            }
                        }
                    }
                }
            }
            // If the category has no commands remove it
            if (this.categories[category] == {}) {
                delete this.categories[category];
            }
        }
    }
}

module.exports = CommandLoader;

/**
 * @typedef {import("../Bot")} Client
 */