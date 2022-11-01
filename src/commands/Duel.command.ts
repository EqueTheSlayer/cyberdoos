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
    const randomNumber = Math.floor(Math.random() * 100);

    setTimeout(() => this.duelists = [], timeout);

    if (this.duelists[0]?.name !== message.author.username) {
      this.duelists.push({
        name: message.author.username,
        number: Number(args[0]),
      });

      if (this.duelists.length === 2) {
        let challengers: Duelist[] = [];

        (randomNumber - this.duelists[0].number) >= (randomNumber - this.duelists[1].number) ? challengers = this.duelists : challengers.push(this.duelists[1]) && challengers.push(this.duelists[0]);

        const answer = {title: `${challengers[0].name} ${getRandomElement(this.possibleHits)} ${challengers[1].name} нанеся ему ${getRandomElement(this.hp)}`};

        this.duelists = [];

        return answer;
      }

      return {title: `${message.author.username} готов пострелять. Кто осмелится бросить ему вызов?`}
    }

    return {
      title: `В результате попытки самоубийства ${message.author.username} ${getRandomElement(this.possibleHits)} нанося себе ${getRandomElement(this.hp)}`
    }
  }
}
