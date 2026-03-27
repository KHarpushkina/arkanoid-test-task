export function createBackgroundImage(scene) {
    const backgroundImage = scene.add
        .image(0, 0, "background")
        .setOrigin(0, 0)
        .setAlpha(0.5);
    backgroundImage.displayWidth = scene.scale.width;
    backgroundImage.displayHeight = scene.scale.height;
}
