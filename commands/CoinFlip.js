const CommandBase = require('./CommandBase');

class CoinFlip extends CommandBase {

  getCoin = () => {
    const coins = ['орел', 'решка'];

    this.reply(`Результат: ${coins[Math.floor(Math.random() * 2)]}`);
  }

  run = () => {
    this.getCoin()
  }
}

module.exports = CoinFlip;
