import {timeout} from "../models/main.model";
import {EmbedBuilder, GuildTextBasedChannel, TextChannel} from "discord.js";
import {GuildId} from "../config.json";
import {ClientModel} from "../models/client.model";


//TODO забери из старого бота рандомный выбор цвета и прикрути к sendMessage
export function sendMessage(textChannel: GuildTextBasedChannel, song: string, thumbnail?: string): void {
    textChannel.send({
        embeds: [new EmbedBuilder().setColor('Red').setDescription(song).setImage(thumbnail)]
    }).then(msg => {
        setTimeout(() => {
            msg.delete();
        }, timeout);
    });
}

export function leaveVoiceChannel(client: ClientModel) {
    client.distube.voices.leave(GuildId);
}