import {
    BRICKS_ANIMATION,
    BRICKS_COLORS,
    SPRITES,
    SPRITESHEETS,
    BACKGROUND_MUSIC_VOLUME,
    SOUNDS,
} from "../constants/index.js";
import { BUFF_DEBUFF_ANIMATION, BUFFS, DEBUFFS } from "../utils/index.js";
export class Preload extends Phaser.Scene {
    constructor() {
        super("Preload");
    }

    preload() {
        //loading sprites
        this.load.image(SPRITES.BACKGROUND, "assets/background_space.png");
        this.load.image(SPRITES.SPEED_UP_BONUS, "assets/speed_up_sprite.png");
        this.load.image(
            SPRITES.SPEED_DOWN_BONUS,
            "assets/speed_down_sprite.png",
        );

        this.load.spritesheet(
            SPRITESHEETS.BRICKS_SPRITES,
            "assets/blocks_spritesheet.png",
            {
                frameWidth: 32,
                frameHeight: 16,
            },
        );

        this.load.spritesheet(
            SPRITESHEETS.BALL_SPRITES,
            "assets/balls_spritesheet.png",
            {
                frameWidth: 16,
                frameHeight: 16,
            },
        );

        this.load.spritesheet(
            SPRITESHEETS.PADDLE_SPRITES,
            "assets/m_tile_spritesheet.png",
            {
                frameWidth: 78,
                frameHeight: 32,
            },
        );

        this.load.spritesheet(
            SPRITESHEETS.HEARTS_SPRITES,
            "assets/hearts_spritesheet.png",
            {
                frameWidth: 32,
                frameHeight: 32,
            },
        );

        this.load.spritesheet(
            SPRITESHEETS.PADDLE_BONUS_SPRITES,
            "assets/paddle_bonus_spritesheet.png",
            {
                frameWidth: 32,
                frameHeight: 16,
            },
        );

        this.load.bitmapFont(
            "fontBitmap",
            "assets/bitmap_0.png",
            "assets/bitmap.fnt",
        );

        this.load.audio(SOUNDS.LEVEL_WIN, "assets/sounds/level_win.mp3");
        this.load.audio(SOUNDS.HIT_BRICK, "assets/sounds/break_brick.mp3");
        this.load.audio(SOUNDS.HIT_PADDLE, "assets/sounds/hit_paddle.mp3");
        this.load.audio(SOUNDS.METALL_BRICK, "assets/sounds/break_metal.mp3");
        this.load.audio(SOUNDS.BUTTON_CLICK, "assets/sounds/button_click.mp3");
        this.load.audio(SOUNDS.BUFF, "assets/sounds/buff.mp3");
        this.load.audio(SOUNDS.DEBUFF, "assets/sounds/debuff.mp3");
        this.load.audio(
            SOUNDS.ENTER_DEATH_ZONE,
            "assets/sounds/death_zone.mp3",
        );
        this.load.audio(SOUNDS.GAME_OVER, "assets/sounds/game_over.mp3");
        this.load.audio(
            SOUNDS.BACKGROUND,
            "assets/sounds/background_sound.mp3",
        );
    }

    create() {
        //background music
        this.backgroundMusic = this.sound.add(SOUNDS.BACKGROUND, {
            volume: BACKGROUND_MUSIC_VOLUME,
            loop: true,
        });

        this.backgroundMusic.play();

        //adding animations
        if (!this.anims.exists(BRICKS_ANIMATION[BRICKS_COLORS.METALL])) {
            this.anims.create({
                key: BRICKS_ANIMATION[BRICKS_COLORS.METALL],
                frames: this.anims.generateFrameNumbers(
                    SPRITESHEETS.BRICKS_SPRITES,
                    {
                        start: 36,
                        end: 41,
                    },
                ),
                frameRate: 5,
                repeat: -1,
            });
        }

        if (!this.anims.exists(BUFF_DEBUFF_ANIMATION[BUFFS.EXPAND_PADDLE])) {
            this.anims.create({
                key: BUFF_DEBUFF_ANIMATION[BUFFS.EXPAND_PADDLE],
                frames: this.anims.generateFrameNumbers(
                    SPRITESHEETS.PADDLE_BONUS_SPRITES,
                    {
                        frames: [14, 13, 12, 11, 10],
                    },
                ),
                frameRate: 4,
                repeat: -1,
            });
        }

        if (
            !this.anims.exists(BUFF_DEBUFF_ANIMATION[DEBUFFS.COLLAPSE_PADDLE])
        ) {
            this.anims.create({
                key: BUFF_DEBUFF_ANIMATION[DEBUFFS.COLLAPSE_PADDLE],
                frames: this.anims.generateFrameNumbers(
                    SPRITESHEETS.PADDLE_BONUS_SPRITES,

                    {
                        start: 0,
                        end: 4,
                    },
                ),
                frameRate: 4,
                repeat: -1,
            });
        }

        this.scene.start("Menu");
    }
}
