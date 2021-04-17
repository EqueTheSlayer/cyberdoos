const CommandBase = require('./CommandBase');

class CoinFlip extends CommandBase {
  constructor(prefix, msg) {
    super(prefix, msg);

    this.getCoin()
  }

  getCoin = () => {
    const coins = ['орел', 'решка'];

    this.reply(`Результат: ${coins[Math.floor(Math.random() * 2)]}`);
  }
}

module.exports = CoinFlip;