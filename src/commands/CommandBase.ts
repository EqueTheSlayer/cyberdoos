import { Message } from "discord.js";

export abstract class CommandBase {
  abstract commandName: string | string[];

  abstract do(command: string, args: string[], message: Message): string | Promise<string>;
}
