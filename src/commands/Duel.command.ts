import {CommandBase} from "./CommandBase";
import {Message} from "discord.js";
import {DuelCommandName, Duelist} from "../models/DuelCommand.model";
import {getRandomElement} from "../utils";
import {timeout} from "../CyberDoos/CyberDoos.model";

export class DuelCommand implements CommandBase {
  commandName = [DuelCommandName.Duel, DuelCommandName.Heal, DuelCommandName.Status];
  hp: string[] = ['10hp', '15hp', '25hp', '75hp', '100hp'];
  duelists: Duelist[] = [];
  possibleHits: string[] = [
    'попал прямо в левое яичко',
    'отстрелил правое яичко',
    'продырявил кишки',
    'оставил дыру в голове'
  ]

  do(command: DuelCommandName, args: string[], message: Message) {
    switch (command) {
      case DuelCommandName.Heal:
        return this.heal(message);
      case DuelCommandName.Duel:
        return this.duel(message, args);
      case DuelCommandName.Status:
        return this.status(message);
    }
  }

  heal(message: Message) {
    return {title: `${message.author.username} получает ${getRandomElement(this.hp)}`};
  }

  status(message: Message) {
    return {title: 'Тут будет содержаться информация о пользователе'}
  }

  duel(message: Message, args: string[]) {
    setTimeout(() => this.duelists = [], timeout);

    if (this.duelists[0]?.name !== message.author.username) {
      this.duelists.push({
        name: message.author.username,
      });

      if (this.duelists.length === 2) {
        const winner = getRandomElement(this.duelists);

        const answer = {title: `${winner.name} ${getRandomElement(this.possibleHits)} ${winner.name === this.duelists[0].name ? this.duelists[1].name : this.duelists[0].name} нанеся ему ${getRandomElement(this.hp)}`};

        this.duelists = [];

        return answer;
      }

      return {title: `${message.author.username} готов пострелять. Кто осмелится бросить ему вызов?`}
    }

    this.duelists = [];

    return {
      title: `В результате попытки самоубийства ${message.author.username} ${getRandomElement(this.possibleHits)} отняв у себя ${getRandomElement(this.hp)}`
    }
  }
}
