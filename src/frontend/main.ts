import "phaser";
import MainScene from "./scenes/mainScene";

const DEFAULT_WIDTH = 1920;
const DEFAULT_HEIGHT = 1080;

const config: Phaser.Types.Core.GameConfig = {
  transparent: true,
  scale: {
    parent: "phaser-game",
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT,
  },
  scene: [MainScene],
  physics: {
    default: "matter",
  },
};

window.addEventListener("load", () => {
  let game = new Phaser.Game(config);
});

//
