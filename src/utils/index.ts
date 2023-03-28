import {timeout} from "../models/main.model";
import {EmbedBuilder, GuildTextBasedChannel, TextChannel} from "discord.js";
import {FormattedSongForAnswer} from "../models/distube.model";

export const colors = [0xff2400, 0xE91E63, 0x9B59B6, 0x00db0f, 0x00ffee, 0x0004ff, 0xf6ff00, 0xff9100];

export function sendMessage(textChannel: GuildTextBasedChannel, song: Partial<FormattedSongForAnswer>): void {
    textChannel.send({
        embeds: [
            new EmbedBuilder()
            .setColor(getRandomElement(colors))
            .setDescription(song.description || null)
            .setImage(song.thumbnail || null)
            .setTitle(song.title || null)
        ]
    }).then(msg => {
        setTimeout(() => {
            msg.delete();
        }, timeout);
    });
}

export function getRandomElement(array: any[]) {
    return array[Math.floor(Math.random() * array.length)];
}