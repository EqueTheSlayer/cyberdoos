class CommandBase {
  constructor(prefix, msg) {
    this.prefix = prefix;
    this.msg = msg;
  }

  getArgs = () => {
    if (this.msg.author.bot === false && this.msg.content.startsWith(this.prefix)) {
      return this.msg.content.split(' ');
    }
  };

  reply = (answer) => {
    this.msg.reply({
      embed: {
        color: 15105570,
        description: answer
      }
    });
  }

  deletingMsg = () => {
    if (this.msg.content.startsWith(this.prefix) || this.msg.author.bot === true) {
      this.msg.delete({ timeout: 300000 });
    }
  }
}

module.exports = CommandBase;