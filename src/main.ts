import {
    Client,
    Events,
    Collection,
    BaseInteraction, EmbedBuilder, GuildMember
} from 'discord.js';
import {ClientModel} from "./models/client.model";
import {Token, AnnaId, GuildId, ChannelIds, BannedGuildId} from './config.json';
import {mongoConnectAddress, databaseName, collectionName} from './mongoConfig.json';
import path from 'path';
import fs from 'fs';
import {DisTube} from 'distube';
import {colors, getRandomElement, sendMessage} from "./utils";
import {distubeModel, FormattedSongForAnswer} from "./models/distube.model";
import {imagesForGoodNightWishes, isGoodNightWish, nameForAnya} from "./models/main.model";
import {repeatType} from "./models/play.model";
import {next, playPause, previous, repeat, row, row2, status, stop} from "./components/buttons";
import {schedule} from 'node-cron';
import {MongoClient} from "mongodb";

const client: ClientModel = new Client({intents: ['Guilds', 'GuildVoiceStates', 'GuildMessages', 'GuildMembers', 'MessageContent']});
const mongoClient = new MongoClient(mongoConnectAddress);

// client.on(Events.GuildCreate, (guild) => {
//     if (guild.id === BannedGuildId) {
//         void guild.leave()
//     }
// })

client.once(Events.ClientReady, async (c) => {

    console.log(`Бот авторизован как ${c.user.tag}`);
    const guild = await client.guilds.cache.get(GuildId);
    const guildUsers = await guild?.members.fetch();
    const channels = ChannelIds.map(async id => {
        return client.channels.cache.get(id)
    });

    // if (guild.id === BannedGuildId) {
    //     void guild.leave()
    // }

    schedule('43 16 * * *', async () => {
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
                                .addFields({
                                    name: 'Был(а) главным пидорасом дня:',
                                    value: `${result[0].timesChosen} раз(а)` || null
                                })
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

client.on(Events.InteractionCreate, async (interaction) => {
    const previousEmoji = client.emojis.cache.get("1104726827756429343"),
        nextEmoji = client.emojis.cache.get("1104731726518943784"),
        stopEmoji = client.emojis.cache.get("1104731761151324170"),
        statusEmoji = client.emojis.cache.get("1104732831290236978"),
        playPauseEmoji = client.emojis.cache.get("1104731744957120522"),
        repeatListEmoji = client.emojis.cache.get("1104731776443764787"),
        repeatSongEmoji = client.emojis.cache.get("1104733022168809532");

    next.setEmoji(nextEmoji.toString());
    previous.setEmoji(previousEmoji.toString());
    playPause.setEmoji(playPauseEmoji.toString());
    playPause.setEmoji(playPauseEmoji.toString());
    stop.setEmoji(stopEmoji.toString());
    status.setEmoji(statusEmoji.toString());
    repeat.setEmoji(repeatListEmoji.toString())

    if (interaction.isButton()) {
        const {member} = interaction;
        //@ts-ignore
        const voiceChannel = member?.voice.channel;
        const queue = await client.distube?.getQueue(voiceChannel);
        switch (interaction.customId) {
            case 'next':
                await interaction.deferReply({ephemeral: true});
                await queue?.skip();
                //@ts-ignore
                await interaction.editReply({content: 'Включаю следующую песню', components: [row, row2]});
                break;
            case 'previous':
                if (queue.previousSongs.length > 0) {
                    await interaction.deferReply({ephemeral: true});
                    await queue?.previous();
                    //@ts-ignore
                    await interaction.editReply({content: 'Включаю предыдущюю песню', components: [row, row2]});
                }
                break;
            case 'playPause':
                await interaction.deferReply({ephemeral: true});
                if (queue.paused) {
                    queue.resume();
                    //@ts-ignore
                    await interaction.editReply({content: 'Продолжаю воспроизведение песни', components: [row, row2]});
                    break;
                }
                queue.pause();
                //@ts-ignore
                await interaction.editReply({content: 'Останавливаю песню', components: [row, row2]});
                break;
            case 'stop':
                await interaction.deferReply({ephemeral: true});
                await queue?.stop();
                //@ts-ignore
                await interaction.editReply({content: 'Выключаю песню и обнуляю очередь'});
                break;
            case 'status':
                //@ts-ignore
                await interaction.reply({
                    content: `Сейчас играет: ${queue.songs[0].name}. ${repeatType[queue.repeatMode]}`,
                    ephemeral: true,
                    components: [row, row2]
                });
                break;
            case 'repeat':
                await interaction.deferReply({ephemeral: true});
                await queue?.setRepeatMode(queue.repeatMode === 2 ? 0 : queue.repeatMode + 1);
                repeat.setStyle(queue.repeatMode > 0 ? 1 : 2)
                repeat.setEmoji(queue.repeatMode === 2 ? repeatListEmoji.toString() : repeatSongEmoji.toString())
                //@ts-ignore
                await interaction.editReply({content: repeatType[queue.repeatMode], components: [row, row2]});
                break;
        }
    }
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