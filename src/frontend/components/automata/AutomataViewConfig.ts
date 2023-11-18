import {
  AutomataSimData,
  AutomataTemplateData,
} from "../../../backend/commands/AutomataCommands";
import {
  BoxConfig,
  XYPair,
  SpriteConfig,
  TextConfig,
  ViewConfig,
} from "../../core/dataTypes";
import { GridCellConfig } from "./GridCellConfig";

export interface AutomataViewConfig extends ViewConfig {
  cell: GridCellConfig;
  boardPosition: BoxConfig;
  boardFillPercentage: number;
  cellCount: XYPair;
  text: TextConfig;
  simData: { [key: string]: AutomataSimData };
  templates: AutomataTemplateData[];
}
