import {PermissionsBitField, SlashCommandBuilder} from 'discord.js';
import {ClientModel} from "../models/client.model";
import {databaseName, guildCollection, mongoConnectAddress} from "../mongoConfig.json";
import {MongoClient} from "mongodb";
import {BotGuildData} from "../models/main.model";

const mongoClient = new MongoClient(mongoConnectAddress);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('faggot')
        .setDescription('Случайным образом определяет пидораса на сегодняшний день')
        .addSubcommand(subcommand =>
            subcommand
                .setName('channel')
                .setDescription('Создает новый канал для этой команды'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('go')
                .setDescription('Включает/выключает функцию определения пидораса')),
    async execute(interaction, client: ClientModel) {
        try {
            const {guild, member, channel, options} = interaction;

            //@ts-ignore
            const isAdmin = member.permissionsIn(channel).has(PermissionsBitField.Flags.Administrator);
            const subCommand = options.getSubcommand();

            if (isAdmin) {
                await mongoClient.connect();

                const db = mongoClient.db(databaseName);
                const collection = db.collection(guildCollection);

                const currentGuild = await collection.findOne<BotGuildData>({guildId: guild.id});

                switch (subCommand) {
                    case 'channel':
                        const createdChannel = await guild.channels.create({name: 'Пидорас дня'});

                        await collection.updateOne({guildId: guild.id}, {
                            $set: {
                                manOfTheDay: true,
                                manOfTheDayChannel: createdChannel.id
                            }
                        }, {upsert: true});

                        await interaction.reply({content: 'Канал был успешно создан, не забудьте переименовать его под ваши нужды!'});
                        break;
                    case 'go':
                        if (!currentGuild.manOfTheDay) {
                            let createdChannel;

                            if (!currentGuild.manOfTheDayChannel) {
                                createdChannel = await guild.channels.create({name: 'Пидорас дня'});

                                await collection.updateOne({guildId: guild.id}, {
                                    $set: {
                                        manOfTheDay: true,
                                        manOfTheDayChannel: createdChannel.id
                                    }
                                }, {upsert: true});

                            }

                            await collection.updateOne({guildId: guild.id}, {
                                $set: {
                                    manOfTheDay: true,
                                }
                            }, {upsert: true});

                            await interaction.reply({content: 'Рубрика "Пидорас дня" теперь активна на этом сервере!'});
                        } else {
                            await collection.updateOne({guildId: guild.id}, {
                                $set: {
                                    manOfTheDay: false,
                                }
                            }, {upsert: true});

                            await interaction.reply({content: 'Рубрика "Пидорас дня" теперь отключена на этом сервере!'});
                        }

                        await mongoClient.close();
                        break;
                }

            }
        } catch
            (e) {
            console.log(e)

            return await interaction.channel.send({content: e, ephemeral: true});
        }
    },
};