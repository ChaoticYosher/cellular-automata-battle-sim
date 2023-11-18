import { AutomataSimData } from "./commands/AutomataCommands";

export class SimCell {
  index: number;
  currentState: number;
  nextState: number;
  neighbours: SimCell[];

  constructor(state: number, index: number) {
    this.currentState = state;
    this.nextState = -1;
    this.neighbours = [];
    this.index = index;
  }

  protected get alive(): boolean {
    return this.currentState > 0;
  }

  public addNeighbour(cell: SimCell) {
    this.neighbours.push(cell);
  }

  public calculateStep(settings: AutomataSimData): number {
    let neighbourCount: number = this.neighbours.filter((n) => n.alive).length;
    let validNeighbours: number[] = this.alive
      ? settings.death
      : settings.birth;
    let willLive: boolean =
      validNeighbours.find((v) => v === neighbourCount) !== undefined;
    let counts: { [key: number]: number } = {};
    let max: number = 0;
    let candidates: number[] = [];
    if (willLive) {
      this.neighbours.forEach((n) => {
        if (n.currentState > 0) {
          counts[n.currentState] = (counts[n.currentState] ?? 0) + 1;
        }
      });
      max = Math.max(...Object.values(counts));
      if (counts[this.currentState] === max) {
        this.nextState = this.currentState;
      } else {
        candidates = Object.entries(counts)
          .filter((countPair) => countPair[1] === max)
          .map((c) => parseInt(c[0]));
        this.nextState =
          candidates[Math.floor(Math.random() * candidates.length)];
      }
    } else {
      this.nextState = 0;
    }
    return this.nextState;
  }

  public step(): void {
    this.currentState = this.nextState;
  }
}
