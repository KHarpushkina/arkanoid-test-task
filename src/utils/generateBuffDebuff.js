import { INITIAL_SPEED } from "./ball.js";
import { SPRITES, SPRITESHEETS } from "../constants/spritesheets.js";

export const BALL_SPEED_BONUS_DURATION = 10000;

export const BONUS_TYPES = {
    DEBUFF: "debuff",
    BUFF: "buff",
};

export const BUFFS = {
    EXPAND_PADDLE: "expandPaddle",
    SLOW_BALL: "slowBall",
};

export const DEBUFFS = {
    COLLAPSE_PADDLE: "collapsePaddle",
    FAST_BALL: "fastBall",
};

export const BUFF_DEBUFF_FRAME = {
    [BUFFS.EXPAND_PADDLE]: {
        type: BONUS_TYPES.BUFF,
        spritesheet: SPRITESHEETS.PADDLE_BONUS_SPRITES,
        frame: 10,
    },
    [BUFFS.SLOW_BALL]: {
        type: BONUS_TYPES.BUFF,
        spritesheet: SPRITES.SPEED_DOWN_BONUS,
    },
    [DEBUFFS.COLLAPSE_PADDLE]: {
        type: BONUS_TYPES.DEBUFF,
        spritesheet: SPRITESHEETS.PADDLE_BONUS_SPRITES,
        frame: 0,
    },
    [DEBUFFS.FAST_BALL]: {
        type: BONUS_TYPES.DEBUFF,
        spritesheet: SPRITES.SPEED_UP_BONUS,
    },
};

export const BUFF_DEBUFF_ANIMATION = {
    [BUFFS.EXPAND_PADDLE]: "expandPaddleAnim",
    [DEBUFFS.COLLAPSE_PADDLE]: "collapsePaddleAnim",
};

const PADDLE_SCALE_STEPS = [0.5, 0.7, 1, 1.3, 1.5];
const BALL_SPEED = [100, 250, INITIAL_SPEED, 490, 610];

// change the paddle size only within the range from 0.5 to 1.5 scale
function changePaddleScale(paddle, direction) {
    const currentScale = paddle.scaleX;

    let currentIndex = PADDLE_SCALE_STEPS.findIndex(
        (step) => step === currentScale,
    );
    let nextIndex = Phaser.Math.Clamp(
        currentIndex + direction,
        0,
        PADDLE_SCALE_STEPS.length - 1,
    );

    const nextScale = PADDLE_SCALE_STEPS[nextIndex];
    paddle.setScale(nextScale, 1);
}

// change the ball speed only within the range from 100 to 610
function changeBallSpeed(direction, scene) {
    const currentSpeed = scene.ballSpeed;

    let currentIndex = BALL_SPEED.findIndex((step) => step === currentSpeed);
    let nextIndex = Phaser.Math.Clamp(
        currentIndex + direction,
        0,
        BALL_SPEED.length - 1,
    );

    const nextSpeed = BALL_SPEED[nextIndex];
    scene.ballSpeed = nextSpeed;
}

// generate rundom buff/debuff and returning sprite with bonus value and bonus type
export const generateBuffDebuff = (scene, { x, y }) => {
    const types = [
        BUFFS.EXPAND_PADDLE,
        DEBUFFS.COLLAPSE_PADDLE,
        BUFFS.SLOW_BALL,
        DEBUFFS.FAST_BALL,
    ];

    const randomType = Phaser.Math.RND.pick(types);
    const frameConfig = BUFF_DEBUFF_FRAME[randomType];
    const bonus = scene.physics.add.sprite(
        x,
        y,
        frameConfig.spritesheet,
        frameConfig.frame || null,
    );

    bonus.bonusValue = randomType;
    bonus.bonusType = frameConfig.type;

    if (BUFF_DEBUFF_ANIMATION[randomType]) {
        bonus.play(BUFF_DEBUFF_ANIMATION[randomType]);
    }

    return bonus;
};

export const applyBuffDebuff = (bonusType, paddle, scene) => {
    switch (bonusType) {
        case BUFFS.EXPAND_PADDLE:
            changePaddleScale(paddle, 1);
            break;

        case BUFFS.SLOW_BALL:
            changeBallSpeed(-1, scene);
            break;

        case DEBUFFS.COLLAPSE_PADDLE:
            changePaddleScale(paddle, -1);
            break;

        case DEBUFFS.FAST_BALL:
            changeBallSpeed(1, scene);
            break;

        default:
            break;
    }
};
