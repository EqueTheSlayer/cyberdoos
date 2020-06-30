const Discord = require('discord.js');
const bot = new Discord.Client();
const request = require('request');
const config = require('./botconfig.json');
const token = config.token;
const prefix = config.prefix;
const express = require("express");
const path = require('path');
const PORT = process.env.PORT || 5016;
const queue = new Map();
let http = require("http");
setInterval(function () {
    http.get('http://cyberdoos.herokuapp.com');
}, 300000);

express()
    .use(express.static(path.join(__dirname, 'public')))
    .set('views', path.join(__dirname, 'views'))
    .set('view engine', 'ejs')
    .get('/', (req, res) => res.render('pages/index'))
    .listen(PORT, () => console.log(`Listening on ${PORT}`))

//ссылка приглашение бота
bot.on('ready', () => {
    console.log(`Запустился бот ${bot.user.username}`);
    bot.generateInvite(["ADMINISTRATOR"]).then(link => {
    });
    bot.user.setActivity('🤖кибержизнь🤖')
});

bot.on('message', async msg => {
    //!help список команд
    if (msg.content.startsWith(`${prefix}help`)) {
        msg.reply({
            embed: {
                color: 15105570,
                description: `Список всех заклинаний: \n
                 ${prefix}roll <число> (показывает случайное число от 0 до <число>)💻\n 
                 ${prefix}flip (подбросить монетку)🏵️ \n
                 ${prefix}погода (текущая погода в указанном городе(eng))🌞\n
                 ${prefix}вирус (статистика заболевших коронавирусом на территории РФ)💊\n 
                 ${prefix}шнейк (показывает ссылку на змейку)🐍 \n
                 ${prefix}invite (показывает ссылку для добавления бота на свой сервер)🤖`
            }
        })
    }
    // удаление сообщений каждые 5 минут
    if (msg.content.startsWith(`${prefix}`)) {
        msg.delete({ timeout: 300000 });
    }
    if (msg.author.bot === true) {
        msg.delete({ timeout: 300000 });
    }
    //случайное число
    if (msg.content.search(`${prefix}[Rr][Oo][Ll][Ll]`) > -1 && msg.author.bot === false) {
        const args = msg.content.split(' ');
        if (isNaN(args[1]) === false && Number(args[1]) >= 0) {
            function getRandomInRange(max) {
                return msg.reply({
                    embed: {
                        color: 15105570,
                        description: `Ваше число ${Math.floor(Math.random() * (max + 1))}`
                    }
                });
            }
            getRandomInRange(Number(args[1]));
        } else {
            msg.reply({
                embed: {
                    color: 15105570,
                    description: `Ты не указал числа или число отрицательное, 🤡`
                }
            })
        }
    }
    //инвайт-ссылка
    if (msg.content.search(`${prefix}[Ii][Nn][Vv][Ii][Tt][Ee]`) > -1 && msg.author.bot === false) {
        msg.reply({
            embed: {
                color: 15105570,
                description: `Я прихожу в гости с помощью этого \n 🧶 https://discord.com/oauth2/authorize?client_id=704994955378163783&scope=bot&permissions=0 🧶`
            }
        })
    }
    //подброс монетки
    if (msg.content.search(`${prefix}[Ff][Ll][Ii][Pp]`) > -1 && msg.author.bot === false) {
        const coins = ['орел', 'решка'];
        const flip = coins[Math.floor(Math.random() * 2)];
        if (flip === 'орел') {
            msg.reply({
                embed: {
                    color: 15105570,
                    description: `Выпал орёл`
                }
            });
        } else {
            msg.reply({
                embed: {
                    color: 15105570,
                    description: `Выпала решка`
                }
            });
        }
    }

    //анекдот 
    const plentyOfJokes = ["Идут по лесу дюймовочка, белоснежка и xуеcoc Дюймовочка говорит:\n -Я самая маленькая на Земле. Белоснежка говорит: \n -Я самая красивая на Земле. Xуеcoc говорит: \n -Я больше всех отсосал xyёв. Идут они, в общем, и заходят в Дом Правды. Дюймовочка в слезах выбегает и говорит: \n -Блин-блин, я не самая маленькая. Меньше меня мальчик-спальчик. Белоснежка тоже выбегает в слезах и кричит: \n -Чёрт, я не самая красивая. Красивее меня спящая красавица. Выходит злой хyecос и говорит: \n -Cyкa, кто такой Илюха?🤬 🤬 🤬",
    "Умерли Илюха, Диман и Ванус. И, попав на приём к богу, все втроём взмолились: \n — Отпусти нас обратно на землю, мало мы пожили ещё, молодые совсем.  \n — Хорошо,—ответил им бог,—но только до первого соблазна. И вот очутились они на земле, в каком-то доме. Видят: пачка снюса. Диман только потянулся — тут же пропал. А Илюха и Ванус вышли из дома и пошли дальше. Вдруг видят на дороге 100 долларов лежат. Ванус наклонился за деньгами и пропали оба.💵 💵 💵",
    "Один бар был известен своим барменом, который давал представления, где он всегда угадывал, что собирается заказать клиент. \n На одном из таких представлений подходит к нему панк. Бармен долго думал, потом, на показ публике, он стукнул по стойке бутылкой пива. Панк обрадовался и пошёл на танцпол. \n Потом подходит негр. Бармен, немного подумав, показательно стукнул по стойке ведром курицы из KFC. Негр обрадовался и пошёл угонять машины. \n Потом подходит Илюха. Бармен сразу же стукнул об стойку резиновый дилдак.🍆 🍆 🍆", 
]

    if (msg.content.search(`${prefix}[Дд][Жж][Оо][Уу][Кк]`) > -1 && msg.author.bot === false) {
        const joke = plentyOfJokes[Math.floor(Math.random() * plentyOfJokes.length)];
        msg.reply({
            embed: {
                color: 15105570,
                description: `${joke}`
            }
        });
    }
    //коронавирус
    if (msg.content.search(`${prefix}[Вв][Ии][Рр][Уу][Сс]`) > -1 && msg.author.bot === false) {
        request("https://pomber.github.io/covid19/timeseries.json", function (err, response, body) {
            if (err) {
                msg.reply({
                    embed: {
                        color: 15105570,
                        description: `⛔Увы, но что-то пошло не так⛔`
                    }
                })
            } else {
                const covidData = JSON.parse(body);
                const lastday = covidData.Russia[covidData.Russia.length - 1];

                msg.reply({
                    embed: {
                        color: 15105570,
                        description: `На данное время на территории Российской Федерации обнаружено 💊${lastday.confirmed}💊 случаев заражения COVID-19, погибло 💀${lastday.deaths}💀 человек.`
                    }
                })
            }
        })
    }
    //погода
    if (msg.content.search(`${prefix}[Пп][Оо][Гг][Оо][Дд][Аа]`) > -1 && msg.author.bot === false) {
        let weatherCountry = msg.content.split(' ');
        const apiKey = '9552deb6aed115532d3abdc34e24d985';
        weatherCountry.shift();
        let weatherCountryWithoutCommand = weatherCountry.join(' ');

        if (weatherCountryWithoutCommand.search(`[Вв][Лл][Гг]`) > -1 || weatherCountryWithoutCommand.search(`[Вв][Оо][Лл][Гг][Оо][Гг][Рр][Аа][Дд]`) > -1) {
            weatherCountryWithoutCommand = 'volgograd';
        };
        if (weatherCountryWithoutCommand.search(`[Уу][Лл]`) > -1) {
            weatherCountryWithoutCommand = 'Ust-Labinsk';
        };
        if (weatherCountryWithoutCommand.search(`[Сс][Пп][Бб]`) > -1 || weatherCountryWithoutCommand.search(`[Пп][Ии][Тт][Ее][Рр]`) > -1) {
            weatherCountryWithoutCommand = 'Saint Petersburg'
        };
        if (weatherCountryWithoutCommand.search(`[Мм][Сс][Кк]`) > -1 || weatherCountryWithoutCommand.search(`[Мм][Оо][Сс][Кк][Вв][Аа]`) > -1) {
            weatherCountryWithoutCommand = 'Moscow'
        };
        const url = `http://api.openweathermap.org/data/2.5/weather?q=${weatherCountryWithoutCommand}&units=metric&lang=RU&appid=${apiKey}`;
        request(url, function (err, response, body) {
            let data = JSON.parse(body);
            if (data.message === 'city not found') {
                msg.channel.send({
                    embed: {
                        color: 15105570,
                        description: `❌🏙️ В моих базах данных такого города нет ❌🏙️`
                    }
                })
            } else {
                let data2 = data.weather.find(item => item.id);
                let temp = Math.floor(data.main.temp);
                if (data2.description == 'ясно') {
                    msg.channel.send({
                        embed: {
                            color: 15105570,
                            description: `${data.name}. Погода в настоящий момент. ☀️${data2.description}☀️\nТемпература составляет 🌈${temp} градусов Цельсия🌈\nСкорость ветра 💨${data.wind.speed} метров в секунду💨.`
                        }
                    })
                }
                if (data2.description.includes('обла')) {
                    msg.channel.send({
                        embed: {
                            color: 15105570,
                            description: `${data.name}. Погода в настоящий момент. ⛅${data2.description}⛅\nТемпература составляет 🌈${temp} градусов Цельсия🌈\nСкорость ветра 💨${data.wind.speed} метров в секунду💨.`
                        }
                    })
                }
                if (data2.description.includes('дожд')) {
                    msg.channel.send({
                        embed: {
                            color: 15105570,
                            description: `${data.name}. Погода в настоящий момент. 🌧️${data2.description}🌧️\nТемпература составляет 🌈${temp} градусов Цельсия🌈\nСкорость ветра 💨${data.wind.speed} метров в секунду💨.`
                        }
                    })
                }
                if (data2.description.includes('пасму')) {
                    msg.channel.send({
                        embed: {
                            color: 15105570,
                            description: `${data.name}. Погода в настоящий момент. ☁️${data2.description}☁️\nТемпература составляет 🌈${temp} градусов Цельсия🌈\nСкорость ветра 💨${data.wind.speed} метров в секунду💨.`
                        }
                    })
                }
                if (data2.description.includes('туман')) {
                    msg.channel.send({
                        embed: {
                            color: 15105570,
                            description: `${data.name}. Погода в настоящий момент. 🌫️${data2.description}🌫️\nТемпература составляет 🌈${temp} градусов Цельсия🌈\nСкорость ветра 💨${data.wind.speed} метров в секунду💨.`
                        }
                    })
                }
            }
        });
    };
    //ссылка на змейку
    if (msg.content.search(`${prefix}[Шш][Нн][Ее][Йй][Кк]`) > -1 && msg.author.bot === false) {
        msg.channel.send({
            embed: {
                color: 15105570,
                description: `🐍🐍🐍 https://equetheslayer.github.io/shnaikjeim 🐍🐍🐍`
            }
        })
    }
})

bot.login(token);