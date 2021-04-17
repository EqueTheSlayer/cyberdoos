const CommandBase = require('./CommandBase');

class RandomNumber extends CommandBase {
  constructor(prefix, msg) {
    super(prefix, msg);

    this.getNumber();
  }

  getNumber = () => {
    const args = this.getArgs();
    let answer = isNaN(args[1]) === false && Number(args[1]) >= 0
      ? `Ваше число ${Math.floor(Math.random() * (args[1] + 1))}`
      : `Ты не указал числа или число отрицательное, <:peepoClown:601743226935705653>`;

    this.reply(answer)
  }
}

module.exports = RandomNumber;