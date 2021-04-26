export function getRandomElement(array:any[]) {
    return array[Math.round(Math.random() * array.length)];
}