import { createMessageScreen } from "../ui/MessageScreen.js";

export class GameOver extends Phaser.Scene {
    constructor() {
        super("GameOver");

        this.levelNumber;
    }

    init(data) {
        this.levelNumber = data.level || 1;
    }

    create() {
        const { actionButton } = createMessageScreen(this, {
            messageText: "GAME OVER",
            actionButtonText: "Restart level",
        });

        actionButton.on("pointerdown", () => {
            this.scene.start("Level", { level: this.levelNumber });
        });
    }
}
