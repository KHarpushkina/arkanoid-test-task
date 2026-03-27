import { levelsCount } from "../constants/index.js";

export const STORAGE_KEYS = {
    highestUnlockedLevel: "highestUnlockedLevel",
};

export const getHighestUnlockedLevel = () => {
    const value = Number(localStorage.getItem("highestUnlockedLevel"));

    if (!value || !Number.isInteger(value) || value < 1) {
        setHighestUnlockedLevel(1);
    }

    if (value > levelsCount) {
        setHighestUnlockedLevel(value);
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
