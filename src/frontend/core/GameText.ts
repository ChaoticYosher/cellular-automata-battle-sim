import { TextConfig } from "./dataTypes";

export class GameText extends Phaser.GameObjects.Text {
  gameWidth: number;
  gameHeight: number;

  constructor(scene: Phaser.Scene, data: TextConfig) {
    let gameWidth = scene.game.config.width as number;
    let gameHeight = scene.game.config.height as number;
    super(
      scene,
      (data.x ?? 0) * gameWidth,
      (data.y ?? 0) * gameHeight,
      data.text ?? "",
      data.style ?? {}
    );

    if (data.scale) {
      this.setScale(data.scale.x, data.scale.y);
    }

    if (data.origin) {
      this.setOrigin(data.origin.x, data.origin.y);
    }

    scene.add.existing(this);
    this.gameWidth = gameWidth;
    this.gameHeight = gameHeight;
  }
}
