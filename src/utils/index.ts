import {BotGuildData, timeout} from "../models/main.model";
import {EmbedBuilder, Snowflake, TextChannel} from "discord.js";
import {FormattedSongForAnswer} from "../models/distube.model";
import {deployCommands} from "../deploy-commands";
import {databaseName, guildCollection} from "../mongoConfig.json";
import exp from "constants";
import {MongoClient} from "mongodb";

export const colors = [0xff2400, 0xE91E63, 0x9B59B6, 0x00db0f, 0x00ffee, 0x0004ff, 0xf6ff00, 0xff9100];

export function sendMessage(textChannel: TextChannel, song: Partial<FormattedSongForAnswer>, canBeDeleted: boolean = true): void {
    textChannel.send({
        embeds: [
            new EmbedBuilder()
                .setColor(getRandomElement(colors))
                .setDescription(song.description || null)
                .setImage(song.thumbnail || null)
                .setTitle(song.title || null)
                .setURL(song.url || null)
        ]
    }).then(msg => {
        if (canBeDeleted) {
            setTimeout(() => {
                msg.delete();
            }, timeout);
        }
    });
}

export function getRandomElement(array: any[]) {
    return array[Math.floor(Math.random() * array.length)];
}

export function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

export async function updateSlashCommands(mongoClient?, guildId?) {
    if (guildId) {
        deployCommands(guildId);
        return;
    }

    await mongoClient.connect();

    const db = mongoClient.db(databaseName);
    const collection = db.collection(guildCollection);

    const guilds = await collection.find({}).toArray();

    guilds.forEach(guild => deployCommands(guild.guildId))

    setTimeout(() => mongoClient.close(), 5000);
}

export async function updateGuildInDb(mongoClient: MongoClient, guildId?: Snowflake) {
    await mongoClient.connect();

    const db = mongoClient.db(databaseName);
    const collection = db.collection(guildCollection);

    if (guildId) {
        await collection.updateOne({guildId: guildId}, {
            $set: {
                guildId: guildId,
            } as BotGuildData
        }, {upsert: true});

        return;
    }

    setTimeout(() => mongoClient.close(), 5000);
}