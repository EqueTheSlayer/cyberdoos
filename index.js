const Discord = require('discord.js');
const bot = new Discord.Client();
const request = require('request');
const config = require('./botconfig.json');
const token = config.token;
const prefix = config.prefix;
const apiKey = '9552deb6aed115532d3abdc34e24d985';
const city = 'volgograd';
const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=RU&appid=${apiKey}`;
//создаём ссылку-приглашение для бота
bot.on('ready', () => {
    console.log(`Запустился бот ${bot.user.username}`);
    bot.generateInvite(["ADMINISTRATOR"]).then(link => {
        console.log(link);
    });
});

bot.on('message', async msg => {
    if (msg.content.startsWith(`${prefix}погода`) && msg.author.bot === false) {
        request(url, function (err, response, body) {
            if(err){
              console.log('error:', error);
            } else {
                let data = JSON.parse(body);
                let data2 = data.weather.find(item => item.id == 800);
                msg.channel.send(`Сегодня в Усть-Парашинске ${data2.description}\n Температура составляет 🔥${data.main.temp}градусов Цельсия🔥\nСкорость ветра 💨${data.wind.speed} метров в секунду💨.`);
                console.log(data);
                console.log(data[0])
            }
          });
          
    }

    console.log(`Запустился бот ${bot.user.username}`)
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
    console.log(msg.author.username + ' (' + msg.author.id + ') ' + ': ' + msg.content);
});

bot.login(token);



