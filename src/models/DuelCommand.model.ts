export enum DuelCommandName {
  Duel = 'duel',
  Status = 'status',
  Heal = 'heal',
}

export interface Duelist{
  name: string;
  number: number;
}
