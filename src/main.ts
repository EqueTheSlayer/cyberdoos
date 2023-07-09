import {
    Client,
    Events,
    Collection,
    BaseInteraction, EmbedBuilder, GuildMember
} from 'discord.js';
import {ClientModel} from "./models/client.model";
import {Token, AnnaId, GuildId, ChannelIds, BannedGuildId, SubsiteId} from './config.json';
import {mongoConnectAddress, databaseName, guildCollection} from './mongoConfig.json';
import path from 'path';
import fs from 'fs';
import {DisTube} from 'distube';
import {colors, getRandomElement, sendMessage} from "./utils";
import {distubeModel, FormattedSongForAnswer} from "./models/distube.model";
import {
    imagesForGoodNightWishes,
    isGoodNightWish,
    leroiPhrases,
    BotGuildData,
    nameForAnya
} from "./models/main.model";
import {repeatType} from "./models/play.model";
import {next, playPause, previous, repeat, row, row2, status, stop} from "./components/buttons";
import {MongoClient} from "mongodb";
import io from "socket.io-client"
import {deployCommands} from "./deploy-commands";
import {schedule} from "node-cron";

const client: ClientModel = new Client({intents: ['Guilds', 'GuildVoiceStates', 'GuildMessages', 'GuildMembers', 'MessageContent']});
const mongoClient = new MongoClient(mongoConnectAddress);

client.on(Events.GuildCreate, async (guild) => {
    // if (guild.id === BannedGuildId) {
    //     void guild.leave()
    // }

    // const channel = guild.channels.create({name: '📣лента-якоря'});
    await mongoClient.connect();

    const db = mongoClient.db(databaseName);
    const collection = db.collection(guildCollection);

    await collection.updateOne({guildId: guild.id}, {
        $set: {
            guildId: guild.id,
            dtfSubsite: false,
            dtfSubsiteLink: '',
            dtfSubsiteChannel: '',
            manOfTheDay: false,
            manOfTheDayChannel: '',
            users: []
        } as BotGuildData
    }, {upsert: true});

    deployCommands(guild.id)

    await mongoClient.close();
    // channel.then((data) => {
    //     console.log(data.id)
    // })
})

client.once(Events.ClientReady, async (c) => {

    console.log(`Бот авторизован как ${c.user.tag}`);


    let socket = io("https://ws-sio.dtf.ru", {
        transports: ["websocket"],
    });

    socket.emit("subscribe", {"channel": "api"});

    socket.on("event", async (data) => {
        if (data.data.type === 'new_entry_published') {
            await mongoClient.connect();

            const db = mongoClient.db(databaseName);
            const collection = db.collection(guildCollection);

            const guilds = await collection.find<BotGuildData>({}).toArray();

            guilds.map(async guild => {
                if (guild.dtfSubsite) {
                    const discordGuild = await client.guilds.cache.get(guild.guildId);
                    console.log(typeof data.data.subsite_id, data.data.subsite_id, guild.dtfSubsiteLink)
                    if (data.data.subsite_id === Number(guild.dtfSubsiteLink)) {
                        const reply = `https://dtf.ru/s/${guild.dtfSubsiteLink}/${data.data.content_id}`;
                        const channel = discordGuild.channels.cache.get(guild.dtfSubsiteChannel);

                        //@ts-ignore
                        channel.send(reply);

                    }
                }
            })

            await mongoClient.close();
        }
    });


    schedule('00 12 * * *', async () => {
        await mongoClient.connect();

        const db = mongoClient.db(databaseName);
        const collection = db.collection(guildCollection);

        const guilds = await collection.find<BotGuildData>({}).toArray();

        guilds.map(async guild => {
            try {
                if (guild.manOfTheDay) {
                    const discordGuild = await client.guilds.cache.get(guild.guildId);
                    const guildUsers = await discordGuild.members.fetch();
                    const randomUser: GuildMember = getRandomElement(Array.from(guildUsers))[1];
                    const channel = discordGuild.channels.cache.get(guild.manOfTheDayChannel);
                    const randomUserImage = randomUser.displayAvatarURL({size: 1024});
                    const result = await collection.find<BotGuildData>({guildId: guild.guildId}).toArray();
                    const userCreatedIndex = result[0].users.findIndex(user => user.userId === randomUser.user.id);
                    const usersArray = result[0].users;
                    let userCreated;
                    if (userCreatedIndex > 0) {
                        userCreated = usersArray[userCreatedIndex];

                        userCreated.timesChosen += 1;
                        usersArray[userCreatedIndex] = userCreated;
                    } else {
                        userCreated = {
                            userId: randomUser.user.id,
                            timesChosen: 1
                        }
                        usersArray.push(userCreated);
                    }

                    await collection.updateOne({guildId: guild.guildId}, {
                        $set: {
                            users: usersArray
                        }
                    });

                    const color = getRandomElement(colors);
                    //@ts-ignore
                    channel.send({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(color)
                                .setDescription(`${randomUser.user} поздравляю! Ты стал(а) главным \n пидорасом на сегодняшний день` || null)
                                .setImage(randomUserImage || null)
                                .setTitle('РУБРИКА "ПИДОРАС ДНЯ"' || null)
                                .addFields({
                                    name: 'Был(а) главным пидорасом дня:',
                                    value: `${userCreated.timesChosen} раз(а)` || null
                                })
                        ]
                    })
                }
            } catch (err) {
                console.log(err)
            } finally {
                await mongoClient.close();
            }

        });
    });


    // if (guild.id === BannedGuildId) {
    //     void guild.leave()
    // }
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


client.distube = new DisTube(client, distubeModel);

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