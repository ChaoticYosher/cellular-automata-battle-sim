import { GameContainer } from "./GameContainer";
import { GameSprite } from "./GameSprite";
import { ButtonConfig } from "./dataTypes";

export class GameButton extends GameContainer {
  protected button: GameSprite;
  constructor(scene: Phaser.Scene, data: ButtonConfig) {
    super(scene, data.x ?? 0, data.y ?? 0);
    this.button = this.createElement(data.button);
    if (data.text) {
      this.createElement(data.text);
    }
    this.setSize(this.button.width, this.button.height);
    this.setInteractive();
  }
}
