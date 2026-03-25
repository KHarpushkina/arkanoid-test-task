export const STORAGE_KEYS = {
    highestUnlockedLevel: "highestUnlockedLevel",
};

export const getHighestUnlockedLevel = () => {
    return Number(localStorage.getItem("highestUnlockedLevel")) || 1;
};

export const setHighestUnlockedLevel = (level) => {
    localStorage.setItem("highestUnlockedLevel", String(level));
};
