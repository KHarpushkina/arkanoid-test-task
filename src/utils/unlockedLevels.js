import { levelsCount } from "../constants";

export const STORAGE_KEYS = {
    highestUnlockedLevel: "highestUnlockedLevel",
};

export const getHighestUnlockedLevel = () => {
    const value = Number(localStorage.getItem("highestUnlockedLevel"));

    if (!Number.isInteger(value)) {
        return 1;
    }

    return Phaser.Math.Clamp(value, 1, levelsCount);
};

export const setHighestUnlockedLevel = (level) => {
    if (!Number.isInteger(level)) {
        return;
    }

    const safeLevel = Phaser.Math.Clamp(level, 1, levelsCount);
    localStorage.setItem("highestUnlockedLevel", String(safeLevel));
};
