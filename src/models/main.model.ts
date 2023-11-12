import {MongoClient} from "mongodb";

export const timeout = 300000;

export const isGoodNightWish = (message: string):boolean => {
    if(message.includes('ноч') || message.includes('снов')) {
        return message.includes('добр') || message.includes('сладк') || message.includes('пок')
    }
    return;
}

export const imagesForGoodNightWishes: string[] = [
    'https://media.tenor.com/UZxQKC5Pk-MAAAAC/sailor-cat-sleeping.gif',
    'https://media.tenor.com/dw0l45Ic1EsAAAAC/adorable-cat.gif',
    'https://media.tenor.com/FnykXKRyX-YAAAAd/cat-sleeping.gif',
    'https://media.tenor.com/SjzBiusoOpIAAAAC/inuyasha-cat.gif',
    'https://media.tenor.com/OVB-Yi84-mkAAAAC/cat-kitten.gif',
    'https://media.tenor.com/Bt0TLtU1DusAAAAC/gatito-cat.gif',
    'https://media.tenor.com/EREEPIwtQOoAAAAd/anime-bedtime.gif',
    'https://media.discordapp.net/attachments/799201152863567903/1055018427972079686/speed-2.gif',
    'https://media.tenor.com/0v5YcAMSSfAAAAAS/cat-dance.gif',
    'https://media.tenor.com/Zp2glQoN94IAAAAC/%D0%B4%D0%BE%D0%B1%D1%80%D0%BE%D0%B5-%D1%83%D1%82%D1%80%D0%BE.gif',
    'https://media.tenor.com/SWvpiKa7PkAAAAAd/wawa-cat-wawa.gif'

];

export const nameForAnya: string[]  = ['Анечка', 'Анчартед', 'Анюта', 'Аннушка', 'Андаинг', 'Анюша', 'Аннус', 'Анняме', 'Анншлаг', 'Аня', 'Анневризма', 'Кураганя', 'Аннапа', 'Аннаконда', 'Анекдот', 'Анна'];

export const NightJuj: string[] = [
    'https://cdn.discordapp.com/attachments/1102342819491881150/1170762467731849306/image.png',
    'https://cdn.discordapp.com/attachments/1102342819491881150/1170764549239083132/image.png',
    'https://cdn.discordapp.com/attachments/1102342819491881150/1170764198108745728/image.png',
];

export const leroiPhrases: string[] = [
    'Фуфыкс ну ты и дурак, нахуя ты играешь в это говно если есть гирзы?',
    'Сони сами виноваты в таком поколении говноедов, оно и не удивительно после такого-то 8-ого поколения консолей',
    'Хз, смотреть однотипное парашное кинцо для умственно отсталых это только сонибоям под силу',
    'БЛЯТЬ ДА ИГРЫ СОНИ ЭТО ГОВНО ЕБАНОЕ РЕДАЛВ ЗАТКНИСЬ НАХУЙ',
    'Day one game pass',
    'Бездарь на дмсоле нихуя не сделал для своего коммьюнити',
    'За свои высказывания я уже расплатился и ничего подобного на этой площадке себе не позволяю',
    'Я слышал, что в Киеве громко похлопали успехам всу на фронте. Или это салют был. Особо не интересуюсь)',
    'Их пригар, наш разъеб по фактам 😎',
    'Хуя ты порвался. Будто у тебя 20% территории спиздили...',
    'Те шедоубана мало? По 1.6 отлететь хочешь? Хорошо, организуем)',
    'Иди нахуй, долбаеб)',
    'Нет, ты просто тупой хуесос😎',
    'Срочно нужен конфликт с кем-нибудь. Кого посоветуете?',
    'Любой, кто отрекается от засилья синей шизи токсиков добро пожаловать',
    'Все сонибои выдумывают хуйню и используют это как аргумент?',
    'Че ты забыл на русском сайте? Че на русском говоришь? Хуесос тупорылый, пиздуй в подвал, дрочи на мечты о том, что вы хоть кому-нибудь нужны в ЕС',
    'Я взял за правило не спорить с уебанами, которые не имеют банальных познаний в теме, о которой они пытаются спорить',
    'Да пошел ты нахуй, Рiмбо комнатний',
    'У нас дискуссия на разных уровнях, долбаеб',
    'Пока ты тут выебываешься в интернете, твою столицу бомбят, броу ;)',
    'Позови Атрея и попроси его перечитать',
    'Тебе не похуй? Че ты доебался-то? Как хочу, так и разговариваю, неженка соевая',
    'За это я уже получил. Модераторы свою работу выполнили. В чем состоит претензия к их работе?'
];

export interface BotGuildData {
    guildId: string,
    users: any[],
    manOfTheDay: boolean,
    manOfTheDayChannel: string;
    dtfSubsite: boolean,
    dtfSubsiteLink: string,
    dtfSubsiteChannel: string,
}