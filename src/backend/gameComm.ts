import { SimCell } from "./SimCell";
import {
  AutomataInitializationCommandData,
  AutomataSocketCommand,
} from "./commands/AutomataCommands";

export function GameCommunication(io, socket) {
  socket.on(
    AutomataSocketCommand.INIT_SIM,
    (data: AutomataInitializationCommandData) => {
      let cells: SimCell[] = data.states.map((s, i) => new SimCell(s, i));
      let row: number = 0;
      let col: number = 0;
      let adjRow: number = 0;
      let adjCol: number = 0;
      let wrapRow: number = 0;
      let wrapCol: number = 0;
      for (row = 0; row < data.height; row++) {
        for (col = 0; col < data.width; col++) {
          for (adjRow = row - 1; adjRow <= row + 1; adjRow++) {
            for (adjCol = col - 1; adjCol <= col + 1; adjCol++) {
              if (adjRow === row && adjCol === col) {
                continue;
              } else {
                wrapRow = (adjRow + data.height) % data.height;
                wrapCol = (adjCol + data.width) % data.width;
                if (
                  !data.settings.wrap &&
                  (wrapRow !== adjRow || wrapCol !== adjCol)
                ) {
                  continue;
                }
                cells[row * data.width + col].addNeighbour(
                  cells[wrapRow * data.width + wrapCol]
                );
              }
            }
          }
        }
      }
      function takeStep() {
        let step: number[] = cells.map((c) => c.calculateStep(data.settings));
        socket.emit(AutomataSocketCommand.UPDATE_CELLS, { states: step });
        cells.forEach((c) => c.step());
      }
      setInterval(takeStep, 64);
    }
  );

  socket.on("ready", () => {
    socket.broadcast.emit("add opponent", 0);
  });

  io.emit("update all", 0);
  setInterval(() => {}, 100 / 30);
}
