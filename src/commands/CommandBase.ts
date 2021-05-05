import {APIMessageContentResolvable, Message} from "discord.js";

// require("lib/discordAPI/InlineMessage");

export abstract class CommandBase {
  abstract commandName: string | string[];

  abstract do(command: string, args: string[], message: Message): string;

  // private getArgs = (message: Message): string[]  => {
  //   if (message.author.bot === false && message.content.startsWith(this.prefix)) {
  //     return message.content.split(' ');
  //   }
  //
  //   return null;
  // };

  // reply = (answer) => {
  //   this.msg.inlineReply({
  //     embed: {
  //       description: answer,
  //       color: 0xff2400,
  //     }
  //   })
  // }

  // deletingMsg = () => {
  //   if (this.msg.content.startsWith(this.prefix) || this.msg.author.bot === true) {
  //     this.msg.delete({ timeout: 300000 });
  //   }
  // }
}
