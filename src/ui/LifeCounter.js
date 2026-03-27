import { SPRITESHEETS } from "../constants/index.js";

export function createLifeCounter(scene, { x, y, restLivesCount = 3 }) {
    const allLivesCount = 3;
    const padding = 35;
    const heartSize = 32;

    const heartFrame = 0;
    const brokenHeartFrame = 4;

    let lifeCounter;

    const hearts = [];
    const startX = scene.scale.width - allLivesCount * heartSize;

    for (let i = 0; i < allLivesCount; i++) {
        const frame = i < restLivesCount ? heartFrame : brokenHeartFrame;

        const heart = scene.add.image(
            startX + i * padding,
            y,
            SPRITESHEETS.HEARTS_SPRITES,
            frame,
        );

        hearts.push(heart);

        if (lifeCounter) {
            lifeCounter.add(heart);
        } else {
            lifeCounter = scene.add.container(x, y, [heart]);
        }
    }

    const updateLives = (newLivesCount) => {
        hearts.forEach((heart, index) => {
            heart.setFrame(
                index < newLivesCount ? heartFrame : brokenHeartFrame,
            );
        });
    };

    return { lifeCounter, updateLives };
}
