import { ElementConfig } from "./dataTypes";

export class GameContainer extends Phaser.GameObjects.Container {
  gameWidth: number;
  gameHeight: number;
  constructor(scene: Phaser.Scene, x: number, y: number) {
    let gameWidth = scene.game.config.width as number;
    let gameHeight = scene.game.config.height as number;
    super(scene, x * gameWidth, y * gameHeight);
    this.gameWidth = gameWidth;
    this.gameHeight = gameHeight;
    scene.add.existing(this);
  }

  createElement(data: ElementConfig, ...args: any[]): any {
    if (data.objectType) {
      let element = new data.objectType(this.scene, data, ...args);
      this.add(element);
      return element;
    }
  }

  protected isDebug(): boolean {
    return (
      (this.scene.game.config.physics.arcade?.debug ?? false) === true ||
      (this.scene.game.config.physics.matter?.debug ?? false) === true
    );
  }
}
