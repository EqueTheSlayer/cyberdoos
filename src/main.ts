import {
    Client,
    Events,
    Collection,
    BaseInteraction, EmbedBuilder, GuildMember
} from 'discord.js';
import {ClientModel} from "./models/client.model";
import {Token, AnnaId, GuildId, ChannelIds} from './config.json';
import {mongoConnectAddress, databaseName, collectionName} from './mongoConfig.json';
import path from 'path';
import fs from 'fs';
import {DisTube} from 'distube';
import {colors, getRandomElement, sendMessage} from "./utils";
import {distubeModel, FormattedSongForAnswer} from "./models/distube.model";
import {imagesForGoodNightWishes, isGoodNightWish, nameForAnya} from "./models/main.model";
import {schedule} from 'node-cron';
import {MongoClient} from "mongodb";

const client: ClientModel = new Client({intents: ['Guilds', 'GuildVoiceStates', 'GuildMessages', 'GuildMembers', 'MessageContent']});
const mongoClient = new MongoClient(mongoConnectAddress);

client.once(Events.ClientReady, async (c) => {
    console.log(`Бот авторизован как ${c.user.tag}`);
    const guild = client.guilds.cache.get(GuildId);
    const guildUsers = await guild.members.fetch();
    const channels = ChannelIds.map(async id => {
        return client.channels.cache.get(id)
    });

    schedule('00 21 * * *', async () => {
        try {
            const randomUser: GuildMember = getRandomElement(Array.from(guildUsers))[1];
            const randomUserImage = randomUser.displayAvatarURL({size: 1024})
            await mongoClient.connect();

            const db = mongoClient.db(databaseName);
            const collection = db.collection(collectionName);
            await collection.updateOne({userId: randomUser.user.id}, {
                $setOnInsert: {
                    userId: randomUser.user.id,
                },
                $inc: {timesChosen: 1}
            }, {upsert: true});
            const result = await collection.find({userId: randomUser.user.id}).toArray();
            const color = getRandomElement(colors);
            channels.forEach(channel => {
                channel.then(data => {
                    //@ts-ignore
                    data.send({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(color)
                                .setDescription(`${randomUser.user} поздравляю! Ты стал(а) главным \n пидорасом на сегодняшний день` || null)
                                .setImage(randomUserImage || null)
                                .setTitle('РУБРИКА "ПИДОРАС ДНЯ"' || null)
                                .addFields({ name: 'Был(а) главным пидорасом дня:', value: `${result[0].timesChosen} раз(а)` || null})
                        ]
                    })
                })
            })
        } catch (err) {
            console.log(err)
        } finally {
            await mongoClient.close();
        }

    });
});

client.commands = new Collection<string, { data: '', execute: () => {} }>();

const commandsPath = path.join(__dirname, 'Commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
    } else {
        console.log(`[WARNING] У команды ${filePath} нет полей "data" или "execute".`);
    }
}

client.distube = new DisTube(client, distubeModel);

module.exports = client;

client.on(Events.InteractionCreate, async (interaction: BaseInteraction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands!.get(interaction.commandName);
    if (!command) {
        console.error(`Команда ${interaction.commandName} не найдена.`);
        return;
    }

    try {
        await command.execute(interaction, client);

    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({content: 'При выполнении команды произошла ошибка!', ephemeral: true});
        } else {
            await interaction.reply({content: 'При выполнении команды произошла ошибка!', ephemeral: true});
        }
    }
});

//пожелание спокойной ночи одному человеку
client.on('messageCreate', (message) => {
    if (message.author.id === AnnaId && isGoodNightWish(message.content.toLowerCase())) {
        void message.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(getRandomElement(colors))
                    .setTitle(`Спокойной ночи ${getRandomElement(nameForAnya)}, сладких тебе сновидений`)
                    .setImage(getRandomElement(imagesForGoodNightWishes))
            ]
        });
    }
});

// TODO СДЕЛАТЬ ОБРАБОТЧИК ЭВЕНТОВ ПО АНАЛОГИИ С КОМАНДАМИ

client.distube
    .on('addSong', (queue, song) => {
        const answerString = queue.songs.length > 1
            ? `добавлен в очередь пользователем ${song.user}`
            : `по заказу ${song.user}`;

        const formattedSong: FormattedSongForAnswer = {
            thumbnail: song.thumbnail,
            description: answerString,
            title: song.name,
            url: song.url
        }

        sendMessage(queue.textChannel, formattedSong)
    })
    .on('error', (textChannel, e) => {
        //TODO шо за цифры
        sendMessage(textChannel, {
            description: `Ошибка: ${e.message.slice(0, 2000)}`,
        })
        console.error(e);
    })
    .on('finish', queue => {
        sendMessage(queue.textChannel, {
            title: 'Песни кончились',
            thumbnail: 'https://i.redd.it/pn1n2ctvla231.jpg',
        })
    });

//TODO СДЕЛАТЬ МЕХАНИКУ ПЕРЕСТРЕЛОК В НОВОЙ КОМАНДЕ

void client.login(Token);