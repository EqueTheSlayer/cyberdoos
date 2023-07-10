import {databaseName, guildCollection} from "../../mongoConfig.json";
import {BotGuildData} from "../../models/main.model";
import {Client, TextChannel} from "discord.js";
import io from "socket.io-client"
import {MongoClient} from "mongodb";
import {DtfSubsiteSocketData} from "./types";

export async function dtfSocket(mongoClient: MongoClient, client: Client) {
    let socket = io("https://ws-sio.dtf.ru", {
        transports: ["websocket"],
    });

    socket.emit("subscribe", {"channel": "api"});

    socket.on("event", async (data) => {
        switch (data.data.type) {
            case 'new_entry_published':
                await dtfSubsiteParser(mongoClient, client, data.data);
                break;
        }
    });
}

async function dtfSubsiteParser(mongoClient: MongoClient, client: Client, dtfResponse: DtfSubsiteSocketData) {
    await mongoClient.connect();

    const db = mongoClient.db(databaseName);
    const collection = db.collection(guildCollection);

    const guilds = await collection.find<BotGuildData>({}).toArray();

    guilds.map(async guild => {
        if (guild.dtfSubsite) {
            const discordGuild = await client.guilds.cache.get(guild.guildId);
            if (dtfResponse.subsite_id === Number(guild.dtfSubsiteLink)) {
                const reply = `https://dtf.ru/s/${guild.dtfSubsiteLink}/${dtfResponse.content_id}`;
                const channel = discordGuild.channels.cache.get(guild.dtfSubsiteChannel) as TextChannel;

                await channel.send(reply);

            }
        }
    })

    await mongoClient.close();
}