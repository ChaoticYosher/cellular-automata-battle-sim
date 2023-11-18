import {
  AutomataSocketCommand,
  AutomataSpawnTemplateCommandData,
} from "./commands/AutomataCommands";
import { GameCommunication } from "./gameComm";

export function clientConnection(io: any, client: any) {
  client.on("message", (channel, tags, message, self) =>
    parseEmoteCommand(channel, tags, message, self, io)
  );

  io.on("connection", function (socket) {
    GameCommunication(io, socket);

    //remove the users data when they disconnect.
    socket.on("disconnect", function () {});
  });

  setInterval(() => {
    var time = new Date();
    // console.log(currentUsers.length+" logged in @ "+ time.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }))
  }, 5000);
}

function parseEmoteCommand(channel, tags, message, self, io) {
  if (tags.emotes == undefined) {
    return;
  }
  const stringReplacements: any[] = [];
  const emotes = tags.emotes;
  // iterate of emotes to access ids and positions
  Object.entries(emotes).forEach(([id, positions]: any) => {
    // use only the first position to find out the emote key word
    const position = positions[0];
    const [start, end] = position.split("-");
    const emote: string = message.substring(
      parseInt(start, 10),
      parseInt(end, 10) + 1
    );
    stringReplacements.push({
      path: `https://static-cdn.jtvnw.net/emoticons/v1/${id}/3.0`,
      emote: emote,
    });
    let commandData: AutomataSpawnTemplateCommandData = {
      templateName: "against the grain",
      team: tags.username,
    };
    // console.log(stringReplacements.map((r) => r.path));
    io.emit(AutomataSocketCommand.SPAWN_TEMPLATE, commandData);
  });
}
