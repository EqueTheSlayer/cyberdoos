import {CommandBase} from "commands/CommandBase";
import {getRandomElement} from "utils";

export class CoinFlipCommand implements CommandBase {
  commandName = "flip";
  coins = ['орел', 'решка'];

  getCoin = () => {
    return `Результат: ${getRandomElement(this.coins)}`;
  }

  do() {
    return this.getCoin()
  }
}

