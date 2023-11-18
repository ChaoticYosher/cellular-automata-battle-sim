export class AutomataSocketCommand {
  public static SPAWN_TEMPLATE: string = "automataSocketCommandSpawnTemplate";
  public static INIT_SIM: string = "automataSocketCommandInitializeSimulation";
  public static UPDATE_CELLS: string = "automataSocketCommandUpdateCells";
}

export enum SimType {
  MAIN = "simTypeMain",
}

export interface AutomataSpawnTemplateCommandData {
  templateName: string;
  team?: number;
  location?: { x: number; y: number };
}

export interface AutomataInitializationCommandData {
  states: number[];
  settings: AutomataSimData;
  width: number;
  height: number;
}

export interface AutomataSimData {
  birth: number[];
  death: number[];
  wrap: boolean;
}

export interface AutomataTemplateData {
  name: string;
  layout: string[];
}

export interface AutomataCellUpdateCommandData {
  states: number[];
}
