import {ActionRowBuilder, ButtonBuilder} from "discord.js";

export const next = new ButtonBuilder()
    .setCustomId('next')
    .setStyle(1)
    .setEmoji('⏭'),
    playPause = new ButtonBuilder()
    .setCustomId('playPause')
    .setStyle(3)
    .setEmoji('⏯'),
    stop = new ButtonBuilder()
    .setCustomId('stop')
    .setStyle(4)
    .setEmoji('⏹'),
    status = new ButtonBuilder()
    .setCustomId('status')
    .setStyle(3)
    .setEmoji('ℹ'),
    repeat = new ButtonBuilder()
    .setCustomId('repeat')
    .setStyle(2)
    .setEmoji('🔁'),
    previous = new ButtonBuilder()
    .setCustomId('previous')
    .setStyle(1)
    .setEmoji('⏮');

export const row = new ActionRowBuilder()
    .addComponents(previous, stop, playPause, next, status),
     row2 = new ActionRowBuilder()
    .addComponents(repeat)