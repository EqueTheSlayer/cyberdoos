import {Message} from "discord.js";

export type CommandList<T> = Array<new () => T>;
export type CommandHandler = (message: Message) => void;
