import { GameButton } from "../../core/GameButton";
import { GameView } from "../../core/GameView";
import { UIEvents } from "./UIEvents";
import { UIViewConfig } from "./UIViewConfig";

export class UIView extends GameView {
  button: GameButton;
  constructor(scene: Phaser.Scene, data: UIViewConfig) {
    super(scene, data);
    this.button = this.createElement(data.button);
    this.button.setInteractive();
    this.button.on("pointerdown", this.handleClick, this);
  }

  handleClick(): void {
    this.emit(UIEvents.RUN_SIMULATION);
  }
}
