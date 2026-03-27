import { levelsCount } from "../constants/index.js";

export const STORAGE_KEYS = {
    highestUnlockedLevel: "highestUnlockedLevel",
};

export const getHighestUnlockedLevel = () => {
    let value = Number(localStorage.getItem("highestUnlockedLevel"));

    if (!Number.isInteger(value) || value < 1) {
        value = 1;
        setHighestUnlockedLevel(1);
    }

    if (value > levelsCount) {
        value = 5;
        setHighestUnlockedLevel(5);
    }

    return value;
};

export const setHighestUnlockedLevel = (level) => {
    if (!Number.isInteger(level)) {
        return;
    }

    const safeLevel = Phaser.Math.Clamp(level, 1, levelsCount);
    localStorage.setItem("highestUnlockedLevel", String(safeLevel));
};
