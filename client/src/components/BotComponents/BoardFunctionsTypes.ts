

export type MinMaxType = {
  board: Array<Array<0 | 1 | 2>>,
  depth: number,
  playerMove: { score: number },
  botMove: { score: number },
  maximizingPlayer: boolean,
}