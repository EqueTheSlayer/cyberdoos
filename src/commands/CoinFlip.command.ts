import {CommandBase} from "commands/CommandBase";

export class CoinFlipCommand implements CommandBase {
  commandName = "flip";
  coins: ['орел', 'решка'];

  getCoin = () => {
    return `Результат: ${this.coins[Math.floor(Math.random() * 2)]}`;
  }

  do() {
    return this.getCoin()
  }
}

