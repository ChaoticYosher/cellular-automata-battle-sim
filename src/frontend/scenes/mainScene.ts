import io from "socket.io-client";
import { AutomataView } from "../components/automata/AutomataView";
import { AutomataViewConfig } from "../components/automata/AutomataViewConfig";
import { GridCell } from "../components/automata/GridCell";
import { GameText } from "../core/GameText";
import { GameView } from "../core/GameView";
import { GameEventData, ViewConfig } from "../core/dataTypes";
import { GameConfig } from "../config/GameConfig";
import {
  AutomataCellUpdateCommandData,
  AutomataSocketCommand,
  AutomataSpawnTemplateCommandData,
  SimType,
} from "../../backend/commands/AutomataCommands";
import { GameButton } from "../core/GameButton";
import { GameSprite } from "../core/GameSprite";
import { UIView } from "../components/ui/UIView";
import { UIViewConfig } from "../components/ui/UIViewConfig";
import { UIEvents } from "../components/ui/UIEvents";

export default class MainScene extends Phaser.Scene {
  firstHi = false;
  socket: SocketIOClient.Socket;
  gameConfig: GameConfig;
  views: { [key: string]: GameView };
  automataView: AutomataView;
  uiView: UIView;

  constructor() {
    super("MainScene");
    this.init();
  }

  addView<V extends GameView, C extends ViewConfig>(
    viewType: new (scene: Phaser.Scene, data: C) => V,
    config: C,
    ...events: GameEventData[]
  ): V {
    let newView: V = new viewType(this.scene.scene, config);
    this.views[config.key] = newView;
    this.add.existing(newView);
    events.forEach((event) => {
      newView.addListener(event.name, event.callback, event.context);
    });
    return newView;
  }

  init() {
    this.views = {};
    this.gameConfig = {
      automataConfig: {
        key: Views.AUTOMATA,
        cell: {
          objectType: GridCell,
          x: 0.5,
          y: 0.5,
          texture: "square",
          scale: { x: 0.75, y: 0.9 },
          teamColours: [0xff0000, 0xff7f00, 0x9f248d, 0xababfe],
        },
        boardPosition: { x: 0.04, y: 0.16, w: 0.92, h: 0.8 },
        boardFillPercentage: 0.2,
        cellCount: { x: 400, y: 225 },
        text: {
          objectType: GameText,
          x: 0.5,
          y: 0.08,
          scale: { x: 1.2, y: 1.2 },
          origin: { x: 0.5, y: 0.5 },
          text: "test",
          style: { color: "#ff0000", fontSize: "64pt" },
        },
        simData: {
          [SimType.MAIN]: {
            birth: [3],
            death: [2, 3],
            wrap: true,
          },
        },
        templates: [
          {
            name: "glider",
            layout: ["***", "*..", ".*."],
          },
          {
            name: "against the grain",
            layout: [
              "...*..*..*..*..*..*..*..*..*..*..*...",
              ".***********************************.",
              "*...................................*",
              ".***********************************.",
              ".....................................",
              ".***********************************.",
              "*...................................*",
              ".***********************************.",
              ".....................................",
              ".***********************************.",
              "*...................................*",
              ".***********************************.",
              ".....................................",
              ".***********************************.",
              "*...................................*",
              ".*****************..****************.",
              ".....................................",
              ".***************......**************.",
              "*...............*....*..............*",
              ".****************....***************.",
              ".....................................",
              ".*************...****...************.",
              "*.................**................*",
              ".************............***********.",
              ".............*..........*............",
              ".**************........*************.",
              "*..............*......*.............*",
              ".***************......**************.",
              "..........**....*....*....**.........",
              ".*******......****..****......******.",
              "*.......*...**...*..*...**...*......*",
              ".*******.........*..*.........******.",
              ".........*.....*......*.....*........",
              ".*********......*....*......********.",
              "*.........*....**.**.**....*........*",
              ".***********....*....*....**********.",
              "............**....**....**...........",
              ".*******..***.*..*..*..*.***..******.",
              "*..............***..***.............*",
              ".*****......***.*....*.***......****.",
              "......*....*..............*....*.....",
              ".******........*......*........*****.",
              "*......*...**..*..**..*..**...*.....*",
              ".********.....*.**..**.*.....*******.",
              ".........*..*.**......**.*..*........",
              ".*********...**........**...********.",
              "*..........*..............*.........*",
              ".****************....***************.",
              ".................****................",
              ".*****************..****************.",
              "*...................................*",
              ".***********************************.",
              "...*..*..*..*..*..*..*..*..*..*..*...",
            ],
          },
          {
            name: "diamond ring",
            layout: [
              "......*......",
              ".....*.*.....",
              "....*.*.*....",
              "....*...*....",
              "..**..*..**..",
              ".*....*....*.",
              "*.*.**.**.*.*",
              ".*....*....*.",
              "..**..*..**..",
              "....*...*....",
              "....*.*.*....",
              ".....*.*.....",
              "......*......",
            ],
          },
          {
            name: "diehard",
            layout: ["......*.", "**......", ".*...***"],
          },
          {
            name: "double-barreled gun",
            layout: [
              ".................*................................",
              ".................**...............................",
              "..................**..............................",
              ".................**...............................",
              "................................*.................",
              "...............................**...............**",
              "..............................**................**",
              ".................**............**.................",
              "**................**..............................",
              "**...............**...............................",
              ".................*................................",
              "...............................**.................",
              "..............................**..................",
              "...............................**.................",
              "................................*.................            ",
            ],
          },
        ],
      },
      uiConfig: {
        key: Views.UI,
        button: {
          objectType: GameButton,
          x: 0.9,
          y: 0.1,
          button: {
            objectType: GameSprite,
            texture: "square",
            tint: { bl: 0xff00ff },
            origin: { x: 0.5, y: 0.5 },
            scale: { x: 0.5, y: 0.5 },
          },
          text: {
            objectType: GameText,
            text: "Press Me",
            origin: { x: 0.5, y: 0.5 },
            style: { color: "#000000", fontSize: "24pt" },
          },
        },
      },
    };
  }

  preload() {
    this.load.image("square", "assets/square.png");
    this.load.image("circle", "assets/circle.png");
  }

  create() {
    this.matter.world.setBounds(
      0,
      0,
      this.game.config.width as number,
      this.game.config.height as number,
      50,
      true,
      true,
      true,
      true
    );

    this.socket = io();
    this.socket.emit("ready");
    this.socket.on(
      AutomataSocketCommand.SPAWN_TEMPLATE,
      (spawnData: AutomataSpawnTemplateCommandData) =>
        this.spawnAutomataTemplate(spawnData)
    );
    this.socket.on(
      AutomataSocketCommand.UPDATE_CELLS,
      (updateData: AutomataCellUpdateCommandData) =>
        this.updateCells(updateData)
    );

    this.automataView = this.addView<AutomataView, AutomataViewConfig>(
      AutomataView,
      this.gameConfig.automataConfig
    );
    this.uiView = this.addView<UIView, UIViewConfig>(
      UIView,
      this.gameConfig.uiConfig,
      {
        name: UIEvents.RUN_SIMULATION,
        callback: this.startAutomataSimulation,
        context: this,
      }
    );
    // this.automataView.createGrid();
  }

  protected spawnAutomataTemplate(
    spawnData: AutomataSpawnTemplateCommandData
  ): void {
    this.automataView.spawnTemplate(spawnData);
  }

  protected startAutomataSimulation(): void {
    this.socket.emit(
      AutomataSocketCommand.INIT_SIM,
      this.automataView.getCurrentState()
    );
  }

  protected updateCells(updateData: AutomataCellUpdateCommandData): void {
    this.automataView.cellUpdate(updateData.states);
  }

  update(time: number, delta: number): void {
    Object.values(this.views).forEach((view: GameView) => {
      view.update(time, delta);
    });
  }

  updateState() {
    //send a position update only if position is changed
    return () => {};
  }
}

export enum Views {
  AUTOMATA = "automataView",
  UI = "uiView",
}
