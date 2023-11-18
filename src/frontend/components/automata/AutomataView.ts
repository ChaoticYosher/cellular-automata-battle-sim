import {
  AutomataInitializationCommandData,
  AutomataSpawnTemplateCommandData,
  AutomataTemplateData,
  SimType,
} from "../../../backend/commands/AutomataCommands";
import { GameText } from "../../core/GameText";
import { GameView } from "../../core/GameView";
import { XYPair } from "../../core/dataTypes";
import { UIEvents } from "../ui/UIEvents";
import { AutomataViewConfig } from "./AutomataViewConfig";
import { GridCell } from "./GridCell";

export class AutomataView extends GameView {
  protected static CELL_CREATE_RATE: number = 8000;

  protected gridData: AutomataViewConfig;
  protected cellOrigin: XYPair;
  protected cellSize: XYPair;
  protected cells: GridCell[];
  protected proxyCells: number[];
  protected testText: GameText;
  protected simType: SimType;
  protected templateColour: number;

  constructor(scene: Phaser.Scene, data: AutomataViewConfig) {
    super(scene, data);
    this.cells = Array.from({ length: data.cellCount.x * data.cellCount.y });
    let cellSet: number[] = Array.from(
      { length: this.cells.length },
      (v, k) => k
    );
    this.proxyCells = Array.from(
      { length: this.cells.length },
      (v, k) => cellSet.splice(Phaser.Math.Between(0, cellSet.length - 1), 1)[0]
    );
    this.gridData = data;
    this.cellSize = {
      x: (data.boardPosition.w * this.gameWidth) / data.cellCount.x,
      y: (data.boardPosition.h * this.gameHeight) / data.cellCount.y,
    };
    this.cellOrigin = {
      x: data.boardPosition.x * this.gameWidth + this.cellSize.x * 0.5,
      y: data.boardPosition.y * this.gameHeight + this.cellSize.y * 0.5,
    };
    this.testText = this.createElement(data.text);
    this.createDebug(data);
    this.simType = SimType.MAIN;
    this.templateColour = 1;
  }

  protected get simStartReady(): boolean {
    return !(this.proxyCells.length > 0);
  }

  protected setCellSizingProperties(cell: GridCell): void {
    cell.x = this.cellOrigin.x + this.cellSize.x * (cell.col ?? 0);
    cell.y = this.cellOrigin.y + this.cellSize.y * (cell.row ?? 0);
    cell.scaleX *= this.cellSize.x / cell.width;
    cell.scaleY *= this.cellSize.y / cell.height;
  }

  protected createGridCell(n: number): void {
    if (n < 0) {
      return;
    }
    let row = Math.floor(n / this.gridData.cellCount.x);
    let col = n % this.gridData.cellCount.x;
    let cell: GridCell = this.createElement(this.gridData.cell, row, col);
    this.setCellSizingProperties(cell);
    cell.value = 0;
    cell.on(UIEvents.CELL_REPORT_SELF, this.onCellReportSelf, this);
    this.cells[n] = cell;
  }

  protected createProxyCell(): void {
    this.createGridCell(this.proxyCells.pop() ?? -1);
  }

  createDebug(data: AutomataViewConfig) {
    if (this.isDebug()) {
      let graphic = this.scene.add.graphics({
        fillStyle: { color: data.cell.tint?.tl ?? 0xffffff, alpha: 1 },
        lineStyle: { color: 0x00ff00, alpha: 1, width: 4 },
      });
      graphic.strokeRect(
        data.boardPosition.x * this.gameWidth,
        data.boardPosition.y * this.gameHeight,
        data.boardPosition.w * this.gameWidth,
        data.boardPosition.h * this.gameHeight
      );
      graphic.strokeRect(-1, -1, this.gameWidth, this.gameHeight);
      this.add(graphic);
    }
  }

  protected setDebugText(text: string) {
    this.testText?.setText(text);
  }

  protected getCoordIndex(row: number, col: number): number {
    return row * this.gridData.cellCount.x + col;
  }

  protected onCellReportSelf(row: number, col: number): void {
    console.log(`${row}, ${col} = ${this.getCoordIndex(row, col)}`);
  }

  public randomize(): void {
    this.cells.forEach((cell) =>
      cell.randomize(this.gridData.boardFillPercentage)
    );
  }

  protected incrementTemplate(): void {
    this.templateColour =
      ((this.templateColour - 1 + 1) % this.gridData.cell.teamColours.length) +
      1;
  }

  protected wrappedIndex(row: number, col: number): number {
    return this.getCoordIndex(
      (row + this.gridData.cellCount.y) % this.gridData.cellCount.y,
      (col + this.gridData.cellCount.x) % this.gridData.cellCount.x
    );
  }

  public spawnTemplate(spawnData: AutomataSpawnTemplateCommandData): void {
    if (!this.simStartReady) {
      return;
    }
    let template: string = spawnData.templateName;
    let templateData: AutomataTemplateData | undefined =
      this.gridData.templates.find((t) => template === t.name);
    let templateGridData: boolean[][];
    let spawnPoint: XYPair = spawnData.location ?? {
      x: Phaser.Math.Between(0, this.gridData.cellCount.x - 1),
      y: Phaser.Math.Between(0, this.gridData.cellCount.y - 1),
    };
    let templateHalfDim: XYPair;
    let tempCell: GridCell;
    if (templateData) {
      templateGridData = templateData.layout.map((templateRow) =>
        Array.from(templateRow, (templateCol) => templateCol === "*")
      );
      if (templateGridData && templateGridData.length > 0) {
        templateHalfDim = {
          x: templateGridData[0].length,
          y: templateGridData.length,
        };
        for (let row: number = 0; row < templateGridData.length; row++) {
          for (let col: number = 0; col < templateGridData[row].length; col++) {
            if (templateGridData[row][col]) {
              tempCell =
                this.cells[
                  this.wrappedIndex(
                    spawnPoint.y - templateHalfDim.y + row,
                    spawnPoint.x - templateHalfDim.x + col
                  )
                ];
              if (tempCell.value === 0) {
                tempCell.value = this.templateColour;
              }
            }
          }
        }
      }
      this.incrementTemplate();
    }
    this.setDebugText(spawnData.templateName);
  }

  public getCurrentState(): AutomataInitializationCommandData {
    return {
      states: this.cells.map((c: GridCell): number => c.value),
      settings: this.gridData.simData[this.simType],
      width: this.gridData.cellCount.x,
      height: this.gridData.cellCount.y,
    };
  }

  public cellUpdate(states: number[]): void {
    this.setDebugText("update");
    this.cells.forEach((cell: GridCell, index: number) => {
      cell.value = states[index];
    });
  }

  public update(time: number, delta: number) {
    if (!this.simStartReady) {
      let numCells = (delta / 1000) * AutomataView.CELL_CREATE_RATE;
      while (!this.simStartReady && numCells > 0) {
        numCells--;
        this.createProxyCell();
        if (this.simStartReady) {
          this.setDebugText(`ready`);
        }
      }
    }
  }
}
