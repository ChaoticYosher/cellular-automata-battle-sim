import { SpriteConfig } from "./dataTypes";

export class GameSprite extends Phaser.GameObjects.Sprite {
  gameWidth: number;
  gameHeight: number;

  constructor(scene: Phaser.Scene, data: SpriteConfig, ...args: any[]) {
    let gameWidth = scene.game.config.width as number;
    let gameHeight = scene.game.config.height as number;
    super(
      scene,
      (data.x ?? 0) * gameWidth,
      (data.y ?? 0) * gameHeight,
      data.texture,
      data.frame
    );

    if (data.tint) {
      this.setTint(data.tint.tl, data.tint.tr, data.tint.bl, data.tint.br);
    }

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
