import { BUTTON_COLORS , BORDER_VALUE } from "../constants/styleVariables.js";

export function createButton(
    scene,
    {
        x,
        y,
        text,
        width = 50,
        height = 40,
        fontSize = 24,
        fillColor = BUTTON_COLORS.background,
        hoverColor = BUTTON_COLORS.backgroundHover,
        borderColor = BUTTON_COLORS.border,
        borderValue = BORDER_VALUE,
    },
) {
    const bg = scene.add
        .rectangle(0, 0, width, height, fillColor)
        .setStrokeStyle(borderValue, borderColor);

    const label = scene.add
        .bitmapText(0, 0, "fontBitmap", text, fontSize)
        .setOrigin(0.5);

    const button = scene.add
        .container(x, y, [bg, label])
        .setSize(width, height)
        .setInteractive();

    button.on("pointerover", () => bg.setFillStyle(hoverColor));
    button.on("pointerout", () => bg.setFillStyle(fillColor));

    return { button };
}
