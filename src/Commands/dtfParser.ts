import {PermissionsBitField, SlashCommandBuilder} from 'discord.js';
import {ClientModel} from "../models/client.model";
import {databaseName, guildCollection, mongoConnectAddress} from "../mongoConfig.json";
import {MongoClient} from "mongodb";
import {BotGuildData} from "../models/main.model";

const mongoClient = new MongoClient(mongoConnectAddress);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dtf')
        .setDescription('Парсер подсайтов dtf.ru')
        .addSubcommand(subcommand =>
            subcommand
                .setName('subsite')
                .setDescription('Добавляет подсайт в список для парсинга')
                .addStringOption(option =>
                    option.setName('input')
                        .setDescription('Введите ID подсайта (только цифры)')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('go')
                .setDescription('Запускает или останавливает функцию на сервере')),
    async execute(interaction, client: ClientModel) {
        try {
            const {options, guild, member, channel} = interaction;
            //@ts-ignore
            const isAdmin = member.permissionsIn(channel).has(PermissionsBitField.Flags.Administrator);

            if (isAdmin) {
                const subCommand = options.getSubcommand();
                await mongoClient.connect();

                const db = mongoClient.db(databaseName);
                const collection = db.collection(guildCollection);

                const currentGuild = await collection.findOne<BotGuildData>({guildId: guild.id});
                switch (subCommand) {
                    case 'go':
                        if (!currentGuild.dtfSubsite) {
                            let createdChannel;

                            if (!currentGuild.dtfSubsiteChannel) {
                                createdChannel = await guild.channels.create({name: 'Подсайт'});

                                await collection.updateOne({guildId: guild.id}, {
                                    $set: {
                                        dtfSubsite: true,
                                        dtfSubsiteChannel: createdChannel.id
                                    }
                                }, {upsert: true});

                            }

                            await collection.updateOne({guildId: guild.id}, {
                                $set: {
                                    dtfSubsite: true,
                                }
                            }, {upsert: true});

                            await interaction.reply({content: 'Лента вашего подсайта теперь будет выводиться в соответствующий канал!'});
                        } else {
                            await collection.updateOne({guildId: guild.id}, {
                                $set: {
                                    dtfSubsite: false,
                                }
                            }, {upsert: true});

                            await interaction.reply({content: 'Лента вашего подсайта больше не будет выводиться в соответствующий канал!'});
                        }
                        break;
                    case 'subsite':
                        await collection.updateOne({guildId: guild.id}, {
                            $set: {
                                dtfSubsiteLink: options.getString("input")
                            }
                        });

                        await interaction.reply({content: 'Хорошо, отныне в созданном мной канале я буду постить ссылки именно на эти посты'});
                }


                await mongoClient.close();
            }

        } catch (e) {
            console.log(e)

            return await interaction.channel.send({content: e, ephemeral: true});
        }
    },
};