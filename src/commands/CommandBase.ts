import { Message } from "discord.js";

export abstract class CommandBase {
  abstract commandName: string | string[];
  //убрать any
  abstract do(command: string, args: string[], message: Message): any;
}
