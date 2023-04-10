import {SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction, CacheType} from'discord.js';
import {ClientModel} from "../models/client.model";
import {repeatType} from "../models/play.model";

module.exports = {
    data: new SlashCommandBuilder()
        .setName('music')
        .setDescription('Компьютерный чилипиздрик')
        .addSubcommand(subcommand =>
            subcommand
                .setName('play')
                .setDescription('Включает песню')
                .addStringOption(option =>
                    option.setName('input')
                        .setDescription('Название песни или ссылка на нее (youtube)')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('stop')
                .setDescription('Останавливает песню'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('next')
                .setDescription('Воспроизводит следующую песню в очереди'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('repeat')
                .setDescription('Повтор песни')
                .addStringOption(option =>
                    option.setName('repeat')
                        .setDescription('0 - отключить повтор, 1 - включить повтор песни, 2 - включить повтор плейлиста')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('status')
                .setDescription('Показывает информацию о текущем треке')),
    async execute(interaction, client: ClientModel) {
        const {options, member, guild, channel} = interaction;
        const subCommand = options.getSubcommand();
        const voiceChannel = member?.voice.channel;
        const queue = await client.distube?.getQueue(voiceChannel);

        try {
            switch (subCommand) {
                case 'play':
                    await interaction.deferReply({ ephemeral: true });
                    await client.distube?.play(voiceChannel, options.getString("input"), {
                        textChannel: channel,
                        member: member,
                        position: -1,
                    });
                    await interaction.editReply({content: 'Нашел, врубаю'});
                    break;
                case 'stop':
                    await interaction.deferReply({ ephemeral: true });
                    await queue?.stop();
                    await interaction.editReply({content: 'Торможу музло'});
                    break;
                case 'repeat':
                    await interaction.deferReply({ ephemeral: true });
                    await queue?.setRepeatMode(Number(options.getString('repeat')));
                    await interaction.editReply({
                        content: repeatType[queue.repeatMode]
                    });
                    break;
                case 'next':
                    await interaction.deferReply({ ephemeral: true });
                    await queue?.skip();
                    await interaction.editReply({content: 'Включаю следующую песню'});
                    break;
                case 'status':
                    await interaction.reply({content: `Сейчас играет: ${queue.songs[0].name}. Повтор: ${queue.repeatMode === 1 ? 'вкл.' : 'выкл.'} `, ephemeral: true});
            }
        } catch (e) {
            console.log(e)
            
            return await interaction.channel.send({content: e, ephemeral: true});
        }
    },
};