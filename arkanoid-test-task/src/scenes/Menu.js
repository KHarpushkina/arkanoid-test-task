import { levelsCount } from "../constants/levels.js";
import {
    getHighestUnlockedLevel,
    setHighestUnlockedLevel,
} from "../utils/unlockedLevels.js";
import { createButton } from "../ui/Button.js";
import { TEXT_COLORS } from "../constants/styleVariables.js";

export class Menu extends Phaser.Scene {
    constructor() {
        super("Menu");

        this.isMobile;
        this.levelsGrid;
        this.unlockedLevel;
    }

    createLevelButtons() {
        this.levelsGrid = this.add.container(0, 0);

        const cols = this.isMobile ? 3 : 5;

        const buttonWidth = 80;
        const buttonHeight = 70;
        const gap = 20;

        for (let i = 0; i < levelsCount; i++) {
            const col = i % cols;
            const row = Math.floor(i / cols);

            const x = col * (buttonWidth + gap);
            const y = row * (buttonHeight + gap);

            const { button } = createButton(this, {
                x,
                y,
                text: `${i + 1}`,
                width: buttonWidth,
                height: buttonHeight,
            });

            if (i + 1 <= this.unlockedLevel) {
                button.on("pointerdown", () => {
                    this.tweens.add({
                        targets: button,
                        scale: 1.2,
                        duration: 300,
                        yoyo: true,
                        onComplete: () => {
                            this.scene.start("Level", { level: i + 1 });
                        },
                    });
                });
            } else {
                button.setAlpha(0.35)
            }

            this.levelsGrid.add(button);
        }

        const totalWidth = (cols - 1) * buttonWidth + (cols - 1) * gap;

        this.levelsGrid.setPosition(
            (this.scale.width - totalWidth) / 2,
            this.scale.height / 2 + 70,
        );
    }

    create() {
        this.unlockedLevel = getHighestUnlockedLevel();

        if (!this.unlockedLevel) {
            setHighestUnlockedLevel(1);
        }

        this.isMobile = this.scale.parentSize.width < 768;

        const topTextGap = 150;

        this.add
            .bitmapText(
                this.scale.width / 2 + 4,
                topTextGap + 4,
                "fontBitmap",
                "BREAKOUT",
                72,
            )
            .setOrigin(0.5)
            .setTint(TEXT_COLORS.shadow)
            .setAlpha(0.7);

        this.add
            .bitmapText(
                this.scale.width / 2,
                topTextGap,
                "fontBitmap",
                "BREAKOUT",
                72,
            )
            .setOrigin(0.5);

        const chooseLevelText = this.add
            .bitmapText(
                this.scale.width / 2,
                topTextGap + 120,
                "fontBitmap",
                "Choose level",
                36,
            )
            .setOrigin(0.5);

        this.tweens.add({
            targets: chooseLevelText,
            scale: { from: 1, to: 1.08 },
            duration: 800,
            yoyo: true,
            repeat: -1,
            ease: "Sine.easeInOut",
        });

        this.createLevelButtons();
    }
}
