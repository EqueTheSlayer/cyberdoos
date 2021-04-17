const CommandBase = require('./CommandBase');

class Calculator extends CommandBase {
  constructor(prefix, msg) {
    super(prefix, msg);
    this.calculate();
  }

  calculate = () => {
    let args = this.getArgs();

    let result;
    switch (args[2]) {
      case '+':
        result = Number(args[1]) + Number(args[3]);
        break;
      case '-':
        result = Number(args[1]) - Number(args[3]);
        break;
      case '*':
        result = Number(args[1]) * Number(args[3]);
        break;
      case '/':
        result = Number(args[1]) / Number(args[3]);
        break;
    }

    this.messageReply(result);
  }

  messageReply = (result) => {
    let answer = isNaN(result) ? `Ты не ввел числа, <:peepoClown:601743226935705653>` : `Ваш ответ: ${result}`;

    this.reply(answer);
  }
}

module.exports = Calculator;