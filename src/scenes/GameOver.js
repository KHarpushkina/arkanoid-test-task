import { createBackgroundImage, createMessageScreen } from "../ui/index.js";

export class GameOver extends Phaser.Scene {
    constructor() {
        super("GameOver");

        this.levelNumber;
    }

    init(data) {
        this.levelNumber = data.level || 1;
    }

    create() {
        createBackgroundImage(this);

        const { actionButton } = createMessageScreen(this, {
            messageText: "GAME OVER",
            actionButtonText: "Restart level",
        });

        actionButton.on("pointerdown", () => {
            this.scene.start("Level", { level: this.levelNumber });
        });
    }
}
