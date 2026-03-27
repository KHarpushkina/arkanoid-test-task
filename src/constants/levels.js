export const levelsCount = 5;

export const levelsPadding = { xPadding: 60, yPadding: 150 };
export const brickSize = { width: 48, height: 24 };

export const BRICKS_COLORS = {
    RED: 0,
    BLUE: 6,
    GREEN: 12,
    PURPLE: 30,
    METALL: 36,
    ORANGE: 42,
    ROSE: 48,
    INDIGO: 54,
};

const { RED, BLUE, GREEN, PURPLE, METALL, ORANGE, ROSE, INDIGO } =
    BRICKS_COLORS;

export const BRICKS_TYPE = {
    UNBREAKABLE: METALL,
    BONUS: ROSE,
};

export const level1 = {
    xGap: 0,
    yGap: 0,
    bricksMatrix: [
        [null, null, RED, RED, null, null, null, null, RED, RED, null, null],
        [null, RED, RED, RED, RED, null, null, RED, RED, RED, RED, null],
        [RED, RED, PURPLE, RED, RED, RED, RED, RED, RED, PURPLE, RED, RED],
        [RED, RED, RED, BLUE, RED, RED, RED, RED, BLUE, RED, RED, RED],
        [null, RED, RED, RED, GREEN, RED, RED, GREEN, RED, RED, RED, null],
        [null, null, RED, RED, RED, ORANGE, ORANGE, RED, RED, RED, null, null],
        [null, null, null, RED, RED, RED, RED, RED, RED, null, null, null],
        [null, null, null, null, RED, RED, RED, RED, null, null, null, null],
        [
            null,
            null,
            null,
            null,
            null,
            INDIGO,
            INDIGO,
            null,
            null,
            null,
            null,
            null,
        ],
    ],
};

export const level2 = {
    xGap: 0,
    yGap: 0,
    bricksMatrix: [
        [RED, RED, PURPLE, RED, RED, RED, PURPLE, RED, METALL, RED],
        [RED, PURPLE, RED, RED, RED, PURPLE, RED, METALL, RED, PURPLE],
        [PURPLE, RED, RED, RED, PURPLE, RED, METALL, RED, PURPLE, RED],
        [RED, RED, RED, PURPLE, RED, METALL, RED, PURPLE, RED, RED],
        [RED, RED, PURPLE, RED, METALL, RED, PURPLE, RED, RED, RED],
        [RED, PURPLE, RED, METALL, RED, PURPLE, RED, RED, RED, RED],
    ],
};

export const level3 = {
    xGap: 0,
    yGap: 0,
    bricksMatrix: [
        [null, null, RED, null, METALL, METALL, null, RED, null, null],
        [null, PURPLE, null, ROSE, RED, RED, ROSE, null, PURPLE, null],
        [RED, null, BLUE, RED, null, null, RED, BLUE, null, RED],
        [null, ROSE, RED, GREEN, PURPLE, PURPLE, GREEN, RED, ROSE, null],
        [METALL, RED, null, PURPLE, ORANGE, ORANGE, PURPLE, null, RED, METALL],
        [METALL, RED, null, PURPLE, ORANGE, ORANGE, PURPLE, null, RED, METALL],
        [null, ROSE, RED, GREEN, PURPLE, PURPLE, GREEN, RED, ROSE, null],
        [RED, null, BLUE, RED, null, null, RED, BLUE, null, RED],
        [null, PURPLE, null, ROSE, RED, RED, ROSE, null, PURPLE, null],
        [null, null, RED, null, METALL, METALL, null, RED, null, null],
    ],
};

export const level4 = {
    xGap: 0,
    yGap: 0,
    bricksMatrix: [
        [null, null, null, PURPLE, null, null, PURPLE, null, null, null],
        [null, null, PURPLE, BLUE, RED, RED, BLUE, PURPLE, null, null],
        [null, PURPLE, BLUE, null, GREEN, GREEN, null, BLUE, PURPLE, null],
        [
            PURPLE,
            BLUE,
            null,
            ORANGE,
            ORANGE,
            ORANGE,
            ORANGE,
            null,
            BLUE,
            PURPLE,
        ],
        [null, RED, GREEN, METALL, ROSE, ROSE, METALL, GREEN, RED, null],
        [null, RED, GREEN, METALL, ROSE, ROSE, METALL, GREEN, RED, null],
        [
            PURPLE,
            BLUE,
            null,
            ORANGE,
            ORANGE,
            ORANGE,
            ORANGE,
            null,
            BLUE,
            PURPLE,
        ],
        [null, PURPLE, BLUE, null, GREEN, GREEN, null, BLUE, PURPLE, null],
        [null, null, PURPLE, BLUE, RED, RED, BLUE, PURPLE, null, null],
        [null, null, null, PURPLE, null, null, PURPLE, null, null, null],
    ],
};

export const level5 = {
    xGap: 0,
    yGap: 0,
    bricksMatrix: [
        [
            METALL,
            null,
            METALL,
            null,
            METALL,
            METALL,
            null,
            METALL,
            null,
            METALL,
        ],
        [PURPLE, RED, RED, RED, RED, RED, RED, RED, RED, PURPLE],
        [PURPLE, RED, METALL, null, null, null, null, METALL, RED, PURPLE],
        [PURPLE, RED, null, ROSE, RED, RED, ROSE, null, RED, PURPLE],
        [PURPLE, RED, RED, RED, METALL, METALL, RED, RED, RED, PURPLE],
        [METALL, ROSE, METALL, null, null, null, null, METALL, ROSE, METALL],
    ],
};

export const BRICKS_ANIMATION = {
    [BRICKS_COLORS.METALL]: "metallBlockShine",
};

export const chooseLevel = (level) => {
    switch (level) {
        case 1:
            return level1;
        case 2:
            return level2;
        case 3:
            return level3;
        case 4:
            return level4;
        case 5:
            return level5;

        default:
            level1;
    }
};
