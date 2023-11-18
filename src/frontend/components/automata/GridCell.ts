import { GameSprite } from "../../core/GameSprite";
import { SpriteConfig } from "../../core/dataTypes";
import { UIEvents } from "../ui/UIEvents";
import { GridCellConfig } from "./GridCellConfig";

export class GridCell extends GameSprite {
  public row: number;
  public col: number;
  protected cellValue: number;
  protected cellData: GridCellConfig;
  constructor(
    scene: Phaser.Scene,
    data: GridCellConfig,
    row: number,
    col: number
  ) {
    super(scene, data);
    this.cellData = data;
    this.row = row;
    this.col = col;
    this.setInteractive();
    this.on(
      "pointerdown",
      () => this.emit(UIEvents.CELL_REPORT_SELF, row, col),
      this
    );
  }

  public get value(): number {
    return this.cellValue;
  }

  public set value(value: number) {
    this.cellValue = value;
    this.visible = this.value > 0;
    if (this.visible) {
      this.setTint(this.cellData.teamColours[this.value - 1]);
    }
  }

  public randomize(odds: number): void {
    if (Phaser.Math.FloatBetween(0, 1) > odds) {
      this.value = 0;
    } else {
      this.value = Phaser.Math.Between(1, this.cellData.teamColours.length);
    }
  }
}
