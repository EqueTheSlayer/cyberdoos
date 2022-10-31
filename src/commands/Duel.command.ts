import {CommandBase} from "./CommandBase";
import {Message} from "discord.js";
import {DuelCommandName} from "../models/DuelCommand.model";

export class DuelCommand implements CommandBase {
  commandName = [DuelCommandName.Duel, DuelCommandName.Heal, DuelCommandName.Status];

  do(command: DuelCommandName, args: string[], message: Message) {
    switch (command) {
      case DuelCommandName.Heal:
        return this.heal(message);
      case DuelCommandName.Duel:
        return this.duel(message);
      case DuelCommandName.Status:
        return this.status(message);
    }
  }

  heal(message: Message) {
        return {title: `${message.author.username} получает 10hp`};
  }

  status(message: Message) {
    return {title: 'Тут будет содержаться информация о пользователе'}
  }

  duel(message: Message) {
    return {title: 'тут один пользователь вызывает другого на дуэль'}
  }
}
