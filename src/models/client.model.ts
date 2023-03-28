import {ApplicationCommand, Client, SlashCommandBuilder} from "discord.js";
import DisTube from "distube";
import {Collection} from "@discordjs/collection";

export interface ClientModel extends Client {
    commands?: Collection<string, { data:any, execute: any }>,
    distube?: DisTube
}