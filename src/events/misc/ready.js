const BaseEvent = require("../../utils/structures/BaseEvent");

class ReadyEvent extends BaseEvent {
    constructor() {
        super("ready");
    }

    run() {
        this.logger.info(`${this.client.user.tag} logged in`);
        this.client.featureLoader.startAll();
    }
}

module.exports = ReadyEvent;