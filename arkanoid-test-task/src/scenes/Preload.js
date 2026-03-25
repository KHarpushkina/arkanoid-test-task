export class Preload extends Phaser.Scene {
    constructor() {
        super("Preload");
    }

    preload() {
        this.load.spritesheet(
            "block_sprites",
            "assets/blocks_spritesheet.png",
            {
                frameWidth: 32,
                frameHeight: 16,
            },
        );

        this.load.spritesheet("ball_sprites", "assets/balls_spritesheet.png", {
            frameWidth: 16,
            frameHeight: 16,
        });

        this.load.spritesheet(
            "paddle_sprites",
            "assets/m_tile_spritesheet.png",
            {
                frameWidth: 78,
                frameHeight: 32,
            },
        );

        this.load.spritesheet(
            "hearts_sprites",
            "assets/hearts_spritesheet.png",
            {
                frameWidth: 32,
                frameHeight: 32,
            },
        );

        this.load.bitmapFont(
            "fontBitmap",
            "assets/bitmap_0.png",
            "assets/bitmap.fnt",
        );
    }

    create() {
        this.scene.start("Menu");
    }
}
