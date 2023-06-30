export const timeout = 300000;

export const isGoodNightWish = (message: string):boolean => {
    if(message.includes('ноч') || message.includes('снов')) {
        return message.includes('добр') || message.includes('сладк') || message.includes('пок')
    }
    return;
}
//
// export const isGoodNightWish = (message: string):boolean => {
//     if(message.includes('хуй') || message.includes('член') || message.includes('залупа') || message.includes('дрын') || message.includes('дрын')) {
//         return message.includes('добр') || message.includes('сладк') || message.includes('пок')
//     }
//     return;
// }

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