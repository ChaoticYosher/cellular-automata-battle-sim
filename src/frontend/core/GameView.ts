import { GameContainer } from "./GameContainer";
import { ViewConfig } from "./dataTypes";

export class GameView extends GameContainer {
  constructor(scene: Phaser.Scene, data: ViewConfig) {
    let dim: { x: number; y: number } = data.dimension
      ? { ...data.dimension }
      : { x: 0, y: 0 };
    super(scene, dim.x, dim.y);
  }
  public init(data: ViewConfig): void {}

  public update(time: number, delta: number) {}
}
