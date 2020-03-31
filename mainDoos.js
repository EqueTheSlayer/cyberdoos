const Discord = require('discord.js');
const bot = new Discord.Client();
const request = require('request');
const config = require('./botconfig.json');
const token = config.token;
const prefix = config.prefix;
const apiKey = '9552deb6aed115532d3abdc34e24d985';
const city = 'volgograd';
const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=RU&appid=${apiKey}`;
const express = require("express");
const path = require('path');
const PORT = process.env.PORT || 5000;

let http = require("http");
setInterval(function() {
    http.get("http://morning-plateau-45402.herokuapp.com");
}, 300000);

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .listen(PORT, () => console.log(`Listening on ${PORT}`))
  
//создаём ссылку-приглашение для бота
bot.on('ready', () => {
    console.log(`Запустился бот ${bot.user.username}`);
    bot.generateInvite(["ADMINISTRATOR"]).then(link => {
    });
});

bot.on('message', async msg => {
    if (msg.content.search(`${prefix}[ПOГОДАпогодаOoAa]+$`) > -1 && msg.author.bot === false) {
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
                if (data2.description.includes('обла')) {
                    msg.channel.send(`\`\`\`Сегодня в Усть-Парашинске ⛅${data2.description}⛅\nТемпература составляет 🔥${temp} градусов Цельсия🔥\nСкорость ветра 💨${data.wind.speed} метров в секунду💨.\`\`\``);
                }
                if (data2.description.includes('дождь')) {
                    msg.channel.send(`\`\`\`Сегодня в Усть-Парашинске 🌧️${data2.description}🌧️\nТемпература составляет 🔥${temp} градусов Цельсия🔥\nСкорость ветра 💨${data.wind.speed} метров в секунду💨.\`\`\``);
                }
            }
          }); 
    }
    let shablon = msg.content.split('');
    if (msg.content.search(`${prefix}[ШАБЛОНшаблонAaOoHh]+$`) && shablon.length >= 4) {
        msg.channel.send(`\'ttr russian Добрый день. С вами ведущая новостей Вилигульма. Сегодня в нашу редакцию поступило крайне опечаливающее сообщение от президента Российской Федерации Владимира Владимировича Путина. В нем сказано, что Соединенные Штаты Америки без предупреждения напали на Усть-Парашинск ровно в 4:20 утра. По предварительным данным, третья мировая война началась из-за некого ${shablon[0]} ${shablon[1]} по кличке ${shablon[2]}. Этот ${shablon[3]} махинатор во время своей игры в доте закинул всю пачку снюса под губу`)
    }
    console.log(msg.author.username + ' (' + msg.author.id + ') ' + ': ' + msg.content);
});
bot.login(token);





