const CommandBase = require('./CommandBase');

class CoinFlip extends CommandBase {
  constructor(prefix, msg) {
    super(prefix, msg);

    this.getCoin()
  }

  getCoin = () => {
    const coins = ['орел', 'решка'];
    const flip = coins[Math.floor(Math.random() * 2)];

    this.reply(`Результат: ${flip}`);
  }
}

module.exports = CoinFlip;