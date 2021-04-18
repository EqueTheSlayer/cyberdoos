const Discord = require('discord.js');
const bot = new Discord.Client();
const config = require('./botconfig.json');
const token = config.token;
const prefix = config.prefix;
const CommandChecker = require('./commands/CommandChecker');
const play = {
    dispatcher: null,
};

//ссылка приглашение бота
bot.on('ready', () => {
    console.log(`Запустился бот ${bot.user.username}`);
    bot.generateInvite(["ADMINISTRATOR"]).then(link => {
    });
    bot.user.setActivity('🤖кибержизнь🤖')
});

bot.on('message', async msg => {
    const checker = new CommandChecker(prefix, msg);

    checker.commandCheck();

    //голосовые связки
    if (msg.content.startsWith(`${prefix}play`) && msg.author.bot === false) {
        if (msg.member.voice.channel) {
            const link = msg.content.split(' ');
            const connection = await msg.member.voice.channel.join();

            const ytdl = require('ytdl-core');
            let stream = ytdl(link[1], {filter: 'audioonly'});
            play.dispatcher = connection.play(stream);

            play.dispatcher.on('finish', () => {
                play.dispatcher.destroy();
                msg.member.voice.channel.leave();
            });
        } else {
            msg.reply('Сперва зайди на канал, дурень');
        }
    }

    if (msg.content.startsWith(`${prefix}stop`) && msg.author.bot === false) {
        play.dispatcher.destroy();
        msg.member.voice.channel.leave();
    }
})

bot.login(token);