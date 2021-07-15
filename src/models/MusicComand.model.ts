import {StreamDispatcher, VoiceConnection} from "discord.js";

export type Play = {
    connection: VoiceConnection,
    dispatcher: StreamDispatcher,
}

export enum MusicCommandName {
    Play = 'play',
    Stop = 'stop',
    Queue = 'queue',
    Next = 'next'
}
