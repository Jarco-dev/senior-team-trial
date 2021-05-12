const BaseEvent = require("../utils/structures/BaseEvent");
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
        this.events = {};
        this.categories = {};

        /**
         * The path to the commands folder
         */
        this.path = "./src/events/"
    }

    /**
     * Load all the commands that are available
     */
    async loadAll() {
        // Get all the categories
        const categories = await fs.readdir(this.path);
        for (const category of categories) {
            // Load the events if it's a folder
            if ((await fs.lstat(this.path + category)).isDirectory()) {
                this.categories[category] = [];
                const files = await fs.readdir(this.path + category);
                // Go through all the event files
                for (const file of files) {
                    if (file.endsWith(".js")) {
                        const Event = require(path.join(__dirname, `${category}/${file}`));
                        if (Event.prototype instanceof BaseEvent) {
                            const event = new Event();
                            this.client.on(event.name, event.run.bind(event))
                            this.categories[category].push(event.name);
                        }
                    }
                }
            }
            // If the category has no events remove it
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