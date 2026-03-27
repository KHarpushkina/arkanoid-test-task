import {
    levelsPadding,
    brickSize,
    levelsCount,
    chooseLevel,
    BRICKS_ANIMATION,
    BRICKS_TYPE,
} from "../constants/levels.js";
import {
    createButton,
    createLifeCounter,
    createMessageScreen,
    createBackgroundImage,
} from "../ui/index.js";
import {
    MENU_COLORS,
    BORDER_VALUE,
    BUTTON_COLORS,
    SOUNDS,
    SOUNDS_VOLUME,
    SPRITESHEETS,
} from "../constants/index.js";
import {
    getHighestUnlockedLevel,
    setHighestUnlockedLevel,
    applyBuffDebuff,
    BALL_SPEED_BONUS_DURATION,
    BONUS_TYPES,
    BUFFS,
    DEBUFFS,
    generateBuffDebuff,
    changeBallSpeed,
    INITIAL_SPEED,
} from "../utils/index.js";

export class Level extends Phaser.Scene {
    constructor() {
        super("Level");

        this.bricks;
        this.paddle;
        this.ball;
        this.isBallLaunched;
        this.levelNumber;
        this.topBar;
        this.gameOverZone;
        this.restLivesCount;
        this.updateLives;
        this.unbreakableCount = 0;
        this.bonuses;
        this.ballSpeed = INITIAL_SPEED;
        this.activeEffects = {};
        this.ballSpeedTimer;

        this.topBarHeight;
    }

    init(data) {
        this.levelNumber = data.level || 1;
        this.unbreakableCount = 0;
        this.bonuses = null;
    }

    preload() {}

    addTopBar() {
        const topBarWidth = this.scale.width - BORDER_VALUE * 2;
        this.topBarHeight = 60;

        this.topBar = this.add
            .rectangle(
                BORDER_VALUE,
                BORDER_VALUE,
                topBarWidth,
                this.topBarHeight,
                MENU_COLORS.background,
            )
            .setStrokeStyle(BORDER_VALUE, BUTTON_COLORS.border, 0.5)
            .setOrigin(0, 0);

        this.physics.add.existing(this.topBar, true);

        const { button: backButton } = createButton(this, {
            x: 80,
            y: 30,
            text: "Back to menu",
            width: 130,
            height: 30,
            fontSize: 16,
            borderValue: 0,
        });

        backButton.on("pointerdown", () => {
            this.scene.start("Menu");
        });
    }

    addGameOverZone() {
        const gameOverWidth = this.scale.width;
        const gameOverHeight = 70;

        this.gameOverZone = this.add
            .rectangle(
                this.scale.width,
                this.scale.height,
                gameOverWidth,
                gameOverHeight,
                0,
                0,
            )
            .setOrigin(1);

        this.physics.add.existing(this.gameOverZone, true);
    }

    addPaddle() {
        this.paddle = this.physics.add.image(
            300,
            520,
            SPRITESHEETS.PADDLE_SPRITES,
            0,
        );
        this.paddle.setScale(1, 1);
        this.paddle.setImmovable(true);
        this.paddle.body.allowGravity = false;
    }

    addBall() {
        this.ball = this.physics.add.image(
            300,
            450,
            SPRITESHEETS.BALL_SPRITES,
            6,
        );

        this.ball.setCollideWorldBounds(true, 1, 1, true);
        this.ball.setBounce(1);
        this.ball.setVelocity(0, 0);

        this.physics.world.on("worldbounds", (body) => {
            if (body.gameObject === this.ball) {
                this.sound.play(SOUNDS.HIT_PADDLE, {
                    volume: SOUNDS_VOLUME,
                });
            }
        });
    }

    resetBall() {
        this.isBallLaunched = false;
        this.ballSpeed = INITIAL_SPEED;
        this.ball.setBounce(1);
        this.ball.setVelocity(0, 0);
    }

    addBricks() {
        this.bricks = this.physics.add.staticGroup();

        const levelConfig = chooseLevel(this.levelNumber);

        const { yPadding } = levelsPadding;
        const { width: brickWidth, height: brickHeight } = brickSize;
        const { xGap, yGap, bricksMatrix } = levelConfig;

        const cols = bricksMatrix[0].length;
        const totalWidth = cols * brickWidth + (cols - 1) * xGap;
        const xPadding = (this.scale.width - totalWidth) / 2 + brickWidth / 2;

        //creating a brick map based on a matrix from config
        bricksMatrix.forEach((row, rowIndex) => {
            row.forEach((frame, colIndex) => {
                if (frame !== null) {
                    const x = xPadding + colIndex * (brickWidth + xGap);
                    const y = yPadding + rowIndex * (brickHeight + yGap);

                    const brick = this.bricks.create(
                        x,
                        y,
                        SPRITESHEETS.BRICKS_SPRITES,
                        frame,
                    );
                    brick.setDisplaySize(brickWidth, brickHeight);
                    brick.refreshBody();

                    //handle unbreakable bricks
                    if (frame === BRICKS_TYPE.UNBREAKABLE) {
                        brick.unbreakable = true;
                        //counting unbreakable bricks to not include them to the WIN bricks count
                        this.unbreakableCount += 1;
                    }

                    //handle bricks with bonuses
                    if (frame == BRICKS_TYPE.BONUS) {
                        brick.bonus = true;
                    }

                    if (BRICKS_ANIMATION[frame]) {
                        brick.play(BRICKS_ANIMATION[frame]);
                    }
                }
            });
        });
    }

    handleBallLoss() {
        this.resetBall();

        this.restLivesCount -= 1;

        if (!this.restLivesCount) {
            this.gameOver();
            return;
        }

        this.sound.play(SOUNDS.ENTER_DEATH_ZONE, {
            volume: 0.8,
        });
        this.updateLives(this.restLivesCount);
    }

    handleWin() {
        this.physics.pause();
        this.sound.play(SOUNDS.LEVEL_WIN, {
            volume: SOUNDS_VOLUME,
        });

        const nextLevel = this.levelNumber + 1;
        const unlockedLevel = getHighestUnlockedLevel();

        if (nextLevel > unlockedLevel && nextLevel <= levelsCount) {
            setHighestUnlockedLevel(unlockedLevel + 1);
        }

        //adding overlay to display message overlapping the game
        this.add
            .rectangle(
                this.scale.width / 2,
                this.scale.height / 2,
                this.scale.width,
                this.scale.height,
                0x000000,
                0.6,
            )
            .setInteractive();

        if (nextLevel <= levelsCount) {
            const { actionButton } = createMessageScreen(this, {
                messageText: "YOU WIN",
                actionButtonText: "NEXT LEVEL",
            });

            actionButton.on("pointerdown", () => {
                this.scene.start("Level", { level: nextLevel });
            });
        } else {
            createMessageScreen(this, {
                messageTextFont: 40,
                messageText: "All levels completed!",
            });
        }
    }

    handleBrickDestroy(brick) {
        if (brick.unbreakable) {
            this.sound.play(SOUNDS.METALL_BRICK, {
                volume: 0.4,
            });

            // if there only unbreakable bricks left - show WIN screen
            if (this.bricks.countActive(true) === this.unbreakableCount) {
                this.handleWin();
            }
        } else {
            this.sound.play(SOUNDS.HIT_BRICK, {
                volume: SOUNDS_VOLUME,
            });

            if (brick.bonus) {
                const bonus = generateBuffDebuff(this, {
                    x: brick.x,
                    y: brick.y,
                });

                this.bonuses.add(bonus);
                bonus.setVelocity(0, 100);
            }

            //shifting the ball's trajectory to avoid its path becoming looped
            const vx = this.ball.body.velocity.x;
            const vy = this.ball.body.velocity.y;
            this.ball.setVelocity(vx + Phaser.Math.Between(-20, 20), vy);

            brick.body.enable = false;
            this.tweens.add({
                targets: brick,
                scaleX: brick.scaleX * 1.2,
                scaleY: brick.scaleY * 1.2,
                alpha: 0,
                duration: 150,
                ease: "Quad.easeOut",
                onComplete: () => {
                    brick.destroy();
                    if (
                        this.bricks.countActive(true) === this.unbreakableCount
                    ) {
                        this.handleWin();
                    }
                },
            });
        }
    }

    handleBonusPickUp(paddle, bonus) {
        const previousSpeed = this.ballSpeed;

        //create timer only for Ball Speed bonuses
        if ([BUFFS.SLOW_BALL, DEBUFFS.FAST_BALL].includes(bonus.bonusValue)) {
            if (this.ballSpeedTimer) {
                this.ballSpeedTimer.remove();
            }

            applyBuffDebuff(bonus.bonusValue, this.paddle, this);
            changeBallSpeed(this.ball, this.ballSpeed, previousSpeed);

            this.ballSpeedTimer = this.time.delayedCall(
                BALL_SPEED_BONUS_DURATION,
                () => {
                    const previousSpeed = this.ballSpeed;
                    this.ballSpeed = INITIAL_SPEED;
                    this.ballSpeedTimer = null;

                    console.log(this.ballSpeed, previousSpeed);
                    changeBallSpeed(this.ball, this.ballSpeed, previousSpeed);
                },
            );
        } else {
            applyBuffDebuff(bonus.bonusValue, this.paddle, this);
        }

        if (bonus.bonusType === BONUS_TYPES.BUFF) {
            this.sound.play(SOUNDS.BUFF, {
                volume: SOUNDS_VOLUME,
            });
        } else {
            this.sound.play(SOUNDS.DEBUFF, {
                volume: SOUNDS_VOLUME,
            });
        }

        bonus.destroy();
    }

    handleHitPaddle() {
        if (this.isBallLaunched) {
            this.sound.play(SOUNDS.HIT_PADDLE, {
                volume: SOUNDS_VOLUME,
            });

            // calculate the correct angle of the ball direction based on where it hits the paddle
            const diff = this.ball.x - this.paddle.x;
            const maxBounceAngle = 50;

            // -1 - ball hits left angle of the paddle
            // 1 - ball hits right angle of the paddle
            // 0 - ball hits middle of the paddle
            const normalized = Phaser.Math.Clamp(
                diff / (this.paddle.displayWidth / 2),
                -1,
                1,
            );

            const angle = Phaser.Math.DegToRad(normalized * maxBounceAngle);

            const vx = this.ballSpeed * Math.sin(angle);
            const vy = -this.ballSpeed * Math.cos(angle);

            this.ball.setVelocity(vx, vy);
        }
    }

    gameOver() {
        this.sound.play(SOUNDS.GAME_OVER, {
            volume: SOUNDS_VOLUME,
        });
        this.scene.start("GameOver", { level: this.levelNumber });
    }

    create() {
        createBackgroundImage(this);
        this.isBallLaunched = false;

        this.addTopBar();
        this.addGameOverZone();
        this.addPaddle();
        this.addBall();
        this.addBricks();

        const { lifeCounter, updateLives } = createLifeCounter(this, {
            x: -10,
            y: 16,
            restLivesCount: 3,
        });

        this.restLivesCount = 3;
        this.updateLives = updateLives;
        this.bonuses = this.physics.add.group();

        this.physics.add.collider(this.ball, this.paddle, () => {
            this.handleHitPaddle();
        });
        this.physics.add.collider(this.ball, this.topBar, () => {
            this.sound.play(SOUNDS.HIT_PADDLE, {
                volume: SOUNDS_VOLUME,
            });
        });
        this.physics.add.collider(this.ball, this.bricks, (ball, brick) => {
            this.handleBrickDestroy(brick);
        });
        this.physics.add.collider(this.ball, this.gameOverZone, () => {
            this.handleBallLoss();
        });
        this.physics.add.overlap(this.paddle, this.bonuses, (paddle, bonus) => {
            this.handleBonusPickUp(paddle, bonus);
        });
        this.physics.add.overlap(
            this.gameOverZone,
            this.bonuses,
            (paddle, bonus) => {
                bonus.destroy();
            },
        );

        this.input.on("pointermove", (pointer) => {
            this.paddle.x = Phaser.Math.Clamp(pointer.x, 50, 550);
        });

        this.input.on("pointerdown", () => {
            if (!this.isBallLaunched) {
                this.isBallLaunched = true;
                this.ball.setVelocity(INITIAL_SPEED, INITIAL_SPEED);
            }
        });
    }

    update() {
        if (!this.isBallLaunched) {
            this.ball.x = this.paddle.x;
            this.ball.y = this.paddle.y - 27;
        }
    }
}
