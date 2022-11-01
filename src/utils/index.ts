export function getRandomElement(array: any[]) {
    return array[Math.floor(Math.random() * array.length)];
}

export function shuffle(array: any[]) {
    return array.sort(() => Math.random() - 0.5);
}