import {StreamDispatcher, VoiceConnection} from "discord.js";

export type Play = {
    connection: VoiceConnection,
    dispatcher: StreamDispatcher,
    timeout: number,
    link: string
}
