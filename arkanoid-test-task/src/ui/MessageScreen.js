import { createButton } from "../ui/Button.js";
import { GAME_OVER_COLORS, TEXT_COLORS } from "../constants/styleVariables.js";

export function createMessageScreen(scene, { messageText, actionButtonText }) {
    const buttonWidth = 300;
    const buttonHeight = 70;
    const topTextGap = 150;
    const topButtonsGap = topTextGap + buttonHeight + 50;

    scene.add
        .bitmapText(
            scene.scale.width / 2 + 4,
            topTextGap + 4,
            "fontBitmap",
            messageText,
            64,
        )
        .setOrigin(0.5)
        .setTint(TEXT_COLORS.shadow)
        .setAlpha(0.7);

    scene.add
        .bitmapText(
            scene.scale.width / 2,
            topTextGap,
            "fontBitmap",
            messageText,
            64,
        )
        .setOrigin(0.5);

    let actionButton = null;

    if (actionButtonText) {
        const { button } = createButton(scene, {
            x: scene.scale.width / 2,
            y: topButtonsGap,
            text: actionButtonText,
            fillColor: GAME_OVER_COLORS.restartLevelBg,
            hoverColor: GAME_OVER_COLORS.restartLevelBgHover,
            width: buttonWidth,
            height: buttonHeight,
        });

        scene.tweens.add({
            targets: button,
            scale: { from: 1, to: 1.08 },
            duration: 800,
            yoyo: true,
            repeat: -1,
            ease: "Sine.easeInOut",
        });

        actionButton = button;
    }

    const { button: backToMenuButton } = createButton(scene, {
        x: scene.scale.width / 2,
        y: actionButtonText ? topButtonsGap + buttonHeight + 25 : topButtonsGap,
        text: "Back to Menu",
        fillColor: GAME_OVER_COLORS.backButtonBg,
        hoverColor: GAME_OVER_COLORS.backButtonBgHover,
        width: buttonWidth,
        height: buttonHeight,
    });

    backToMenuButton.on("pointerdown", () => {
        scene.scene.start("Menu");
    });

    return { actionButton };
}
