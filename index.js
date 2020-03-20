const Discord = require('discord.js');
const bot = new Discord.Client();
const ms = require('ms')
let config = require('./botconfig.json');
let token = config.token;
let prefix = config.prefix;
//создаём ссылку-приглашение для бота
bot.on('ready', () => {
    console.log(`Запустился бот ${bot.user.username}`);
    bot.generateInvite(["ADMINISTRATOR"]).then(link => {
        console.log(link);
    });
});

bot.on('message', async msg => {
    if (msg.author.bot) return;

    if (msg.content === 'Кибердус уходит на техобслуживание') {
        msg.channel.send('Я не умру, я буду жить вечно <:rage:664912198128369696><:rage:664912198128369696><:rage:664912198128369696>');
    }

    if (msg.content) {
        msg.react('601743226935705653');
    }

    if (msg.author.id === '274610371417866242') {
        msg.react('623189484510511120');
    }

    if (msg.author.id === '274614692385652737') {
        msg.react('👉👌');
    }

    if (msg.author.id === '274616115379044362') {
        msg.react('664912198128369696');
    }

    if (msg.author.id === '268435331567714314') {
        msg.react('627533450953490435');
    }

    if (msg.author.id === '281120774289489922') {
        msg.react('🤡');
    }

    if (msg.author.id === '547007942029737994') {
        msg.react('579742337794572405');
    }

if(msg.author.id !== '268435331567714314') {
    if (msg.content.startsWith(`${prefix}kick`)) {
        let member= msg.mentions.members.first();
        member.kick().then((member) => {
            msg.channel.send(":wave: " + member.displayName + " был изгнан с позором в помойку говна :point_right: ");
        }).catch(() => {
            msg.channel.send("С чего мне тебя слушать, клоун????");
        });
    }
}
    console.log(msg.author.username + ' (' + msg.author.id + ') ' + ': ' + msg.content);
});

bot.login(token);



