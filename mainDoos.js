const Discord = require('discord.js');
const bot = new Discord.Client();
const request = require('request');
const config = require('./botconfig.json');
const token = config.token;
const prefix = config.prefix;
const apiKey = '9552deb6aed115532d3abdc34e24d985';
const city = 'volgograd';
const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=RU&appid=${apiKey}`;
const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const host = '0.0.0.0'
//создаём ссылку-приглашение для бота
bot.on('ready', () => {
    console.log(`Запустился бот ${bot.user.username}`);
    bot.generateInvite(["ADMINISTRATOR"]).then(link => {
    });
});

bot.on('message', async msg => {
    if (msg.content.startsWith(`${prefix}погода`) && msg.author.bot === false) {
        request(url, function (err, response, body) {
            if(err){
                console.log('ошибка');
            } else {
                let data = JSON.parse(body);
                console.log(data);
                let data2 = data.weather.find(item => item.id);
                let temp = Math.floor(data.main.temp);
                if (data2.description == 'ясно') {
                    msg.channel.send(`\`\`\`Сегодня в Усть-Парашинске ☀️${data2.description}☀️\nТемпература составляет 🔥${temp} градусов Цельсия🔥\nСкорость ветра 💨${data.wind.speed} метров в секунду💨.\`\`\``);
                }
                if (data2.description.includes('облачность')) {
                    msg.channel.send(`\`\`\`Сегодня в Усть-Парашинске ⛅${data2.description}⛅\nТемпература составляет 🔥${temp} градусов Цельсия🔥\nСкорость ветра 💨${data.wind.speed} метров в секунду💨.\`\`\``);
                }
            }
          }); 
    }
    console.log(msg.author.username + ' (' + msg.author.id + ') ' + ': ' + msg.content);
});

bot.login(token);

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .listen(PORT, host, () => console.log(`Listening on ${ PORT }`))




