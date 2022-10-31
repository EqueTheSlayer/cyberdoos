import {CommandBase} from "./CommandBase";
import {Message} from "discord.js";
import {DuelCommandName} from "../models/DuelCommand.model";

export class DuelCommand implements CommandBase {
  commandName: '123';

  do(command: DuelCommandName, args: string[], message: Message) {
    switch (command) {
      case DuelCommandName.Heal:
        return 'heal';
      case DuelCommandName.Duel:
        return 'duel';
      case DuelCommandName.Status:
        return 'status';
    }
  }
}
