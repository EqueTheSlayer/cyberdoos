const CommandBase = require('./CommandBase');

class Calculator extends CommandBase {

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

  run = () => {
    this.calculate();
  }

  messageReply = (result) => {
    let answer = isNaN(result) ? `Ты не ввел числа, <:peepoClown:601743226935705653>` : `Ваш ответ: ${result}`;

    this.reply(answer);
  }

  static command = (prefix) => `${prefix}calc`;
}

module.exports = Calculator;
