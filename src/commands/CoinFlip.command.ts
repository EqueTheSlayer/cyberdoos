import {CommandBase} from "commands/CommandBase";
import {getRandomElement} from "utils";

export class CoinFlipCommand implements CommandBase {
  commandName = 'flip';
  coins = ['орел', 'решка'];

  getCoin = () => {
    return {
      title: `Результат: ${getRandomElement(this.coins)}`,
      color: 'red'
    };
  }

  do() {
    return this.getCoin();
  }
}

