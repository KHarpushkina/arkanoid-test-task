import { level1, levelsPadding, brickSize } from "../constants/levels.js";
import { createButton } from "../ui/Button.js";
import { createMessageScreen } from "../ui/MessageScreen.js";
import { createLifeCounter } from "../ui/LifeCounter.js";
import {
    MENU_COLORS,
    BORDER_VALUE,
    BUTTON_COLORS,
} from "../constants/styleVariables.js";
import {
    getHighestUnlockedLevel,
    setHighestUnlockedLevel,
} from "../utils/unlockedLevels.js";

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

        this.topBarHeight;
    }

    init(data) {
        this.levelNumber = data.level || 1;
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
        this.paddle = this.physics.add.image(300, 520, "paddle_sprites", 0);

        this.paddle.setImmovable(true);
        this.paddle.body.allowGravity = false;
    }

    addBall() {
        this.ball = this.physics.add.image(300, 450, "ball_sprites", 6);

        this.ball.setCollideWorldBounds(true);
        this.ball.setBounce(1);
        this.ball.setVelocity(0, 0);
    }

    resetBall() {
        this.isBallLaunched = false;

        this.ball.setCollideWorldBounds(true);
        this.ball.setBounce(1);
        this.ball.setVelocity(0, 0);
    }

    addBricks() {
        this.bricks = this.physics.add.staticGroup();

        const { yPadding } = levelsPadding;
        const { width: brickWidth, height: brickHeight } = brickSize;
        const { xGap, yGap, bricksMatrix } = level1;

        const cols = bricksMatrix[0].length;

        const totalWidth = cols * brickWidth + (cols - 1) * xGap;

        const xPadding = (this.scale.width - totalWidth) / 2 + brickWidth / 2;

        bricksMatrix.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                if (cell === 1) {
                    const x = xPadding + colIndex * (brickWidth + xGap);
                    const y = yPadding + rowIndex * (brickHeight + yGap);

                    const brick = this.bricks.create(x, y, "block_sprites", 0);
                    brick.setDisplaySize(brickWidth, brickHeight);
                    brick.refreshBody();
                }
            });
        });
    }

    handleBallLoss() {
        this.resetBall();

        this.restLivesCount -= 1;

        if (!this.restLivesCount) {
            this.gameOver();
        }

        this.updateLives(this.restLivesCount);
    }

    handleWin() {
        this.physics.pause();

        const nextLevel = this.levelNumber + 1;
        const unlockedLevel = getHighestUnlockedLevel();

        if (nextLevel > unlockedLevel && nextLevel < levelsCount) {
            setHighestUnlockedLevel(unlockedLevel + 1);
        }

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

        if (nextLevel < levelsCount) {
            const { actionButton } = createMessageScreen(this, {
                messageText: "YOU WIN",
                actionButtonText: "NEXT LEVEL",
            });

            actionButton.on("pointerdown", () => {
                this.scene.start("Level", { level: nextLevel });
            });
        } else {
            createMessageScreen(this, {
                messageText: "All levels completed!",
            });
        }
    }

    handleBrickDestroy(brick) {
        brick.destroy();

        if (this.bricks.countActive(true) === 0) {
            this.handleWin();
        }
    }

    handleHitPaddle(ball, paddle) {
        if (this.isBallLaunched) {
            const diff = ball.x - paddle.x;
            const maxBounceAngle = 75;
            const speed = 270;

            const normalized = Phaser.Math.Clamp(
                diff / (paddle.displayWidth / 2),
                -1,
                1,
            );
            const angle = Phaser.Math.DegToRad(normalized * maxBounceAngle);

            ball.setVelocity(speed * Math.sin(angle), -speed);
        }
    }

    gameOver() {
        this.scene.start("GameOver");
    }

    create() {
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

        this.physics.add.collider(this.ball, this.paddle, (ball, paddle) => {
            this.handleHitPaddle(ball, paddle);
        });
        this.physics.add.collider(this.ball, this.topBar);
        this.physics.add.collider(this.ball, this.bricks, (ball, brick) => {
            this.handleBrickDestroy(brick);
        });
        this.physics.add.collider(this.ball, this.gameOverZone, () => {
            this.handleBallLoss();
        });

        this.input.on("pointermove", (pointer) => {
            this.paddle.x = Phaser.Math.Clamp(pointer.x, 50, 550);
        });

        this.input.on("pointerdown", () => {
            if (!this.isBallLaunched) {
                this.isBallLaunched = true;
                this.ball.setVelocity(270, -270);
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
