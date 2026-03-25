import { Level } from "./scenes/Level.js";
import { Preload } from "./scenes/Preload.js";
import { Menu } from "./scenes/Menu.js";
import { GameOver } from "./scenes/GameOver.js";

const config = {
    type: Phaser.AUTO,
    title: "Overlord Rising",
    description: "",
    parent: "game-container",
    width: 600,
    height: 600,
    backgroundColor: "#171d2c",
    pixelArt: true,
    physics: {
        default: "arcade",
        arcade: {
            debug: false,
        },
    },
    scene: [Preload, Menu, Level, GameOver],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
};

new Phaser.Game(config);
