const CommandBase = require('./CommandBase');
const Calculator = require('./Calculator');
const Help = require('./Help');
const CoinFlip = require('./CoinFlip');
const RandomNumber = require('./RandomNumber');
const Joke = require('./Joke');

class CommandChecker extends CommandBase {
  constructor(prefix, msg) {
    super(prefix, msg);
    this.commands = [Calculator, Help, CoinFlip, RandomNumber, Joke];
    this.deletingMsg();
  }

  commandCheck = () => {
    const args = this.getArgs();
    args && this.commands.map(item => {
      if (args[0] === item.command(this.prefix)) {
        let obj = new item(this.prefix, this.msg);
        obj.run();
      }
    })
  }
}

module.exports = CommandChecker;
