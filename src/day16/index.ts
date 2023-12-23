import { getDIO } from '../helpers/index.ts'
import path from 'path'

export const dio = getDIO(path.resolve('./src/day16'))

type PipeChar = '.' | '/' | '\\' | '|' | '-'

type Direction = 'N' | 'E' | 'S' | 'W'

type DirectionMap = Record<Direction, Direction[]>

type PipesToDirectionMap = Record<PipeChar, DirectionMap>

interface Position {
  x: number
  y: number
}

interface TravellingNode {
  position: Position
  direction: Direction
}

const pipes: PipesToDirectionMap = {
  '.': {
    N: ['N'],
    E: ['E'],
    S: ['S'],
    W: ['W']
  },
  '/': {
    N: ['E'],
    E: ['N'],
    S: ['W'],
    W: ['S']
  },
  '\\': {
    N: ['W'],
    E: ['S'],
    S: ['E'],
    W: ['N']
  },
  '|': {
    N: ['N'],
    S: ['S'],
    E: ['N', 'S'],
    W: ['N', 'S']
  },
  '-': {
    E: ['E'],
    W: ['W'],
    N: ['E', 'W'],
    S: ['E', 'W']
  }
}

const getNeighbours = (
  pipe: PipeChar,
  top: TravellingNode,
  width: number,
  height: number
): TravellingNode[] => {
  const { position: { x, y }, direction } = top
  const connections: Direction[] = pipes[pipe][direction]
  const result: TravellingNode[] = []
  if (y > 0 && connections.includes('W')) {
    result.push({ position: { x, y: y - 1 }, direction: 'W' })
  }
  if (y < width - 1 && connections.includes('E')) {
    result.push({ position: { x, y: y + 1 }, direction: 'E' })
  }
  if (x > 0 && connections.includes('N')) {
    result.push({ position: { x: x - 1, y }, direction: 'N' })
  }
  if (x < height - 1 && connections.includes('S')) {
    result.push({ position: { x: x + 1, y }, direction: 'S' })
  }
  return result
}

dio.params.starting = { position: { x: 0, y: 0 }, direction: 'E' }

dio.part1 = input => {
  const height = input.length
  const width = input[0].length
  const visited: Array<Array<Record<Direction, boolean>>> = Array(height).fill(1).map(() => Array(width).fill(1).map(() => ({ N: false, E: false, S: false, W: false })))
  const queue: TravellingNode[] = [dio.params.starting]
  let top
  while ((top = queue.shift()) !== undefined) {
    const { position: { x, y }, direction } = top
    if (!visited[x][y][direction]) {
      visited[x][y][direction] = true
      const neighbours = getNeighbours(input[x][y] as PipeChar, top, width, height)
      neighbours.forEach(it => queue.push(it))
    }
  }

  let total = 0
  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      const { N, E, S, W } = visited[i][j]
      if (N || E || S || W) {
        total++
      }
    }
  }
  return total
}

dio.part2 = input => {
  const height = input.length
  const width = input[0].length
  let max = 0
  for (let i = 0; i < height; i++) {
    dio.params.starting = { position: { x: i, y: 0 }, direction: 'E' }
    let res: number = dio.part1(input) as number
    max = res > max ? res : max
    dio.params.starting = { position: { x: i, y: width - 1 }, direction: 'W' }
    res = dio.part1(input) as number
    max = res > max ? res : max
  }
  for (let j = 0; j < width; j++) {
    dio.params.starting = { position: { x: 0, y: j }, direction: 'S' }
    let res: number = dio.part1(input) as number
    max = res > max ? res : max
    dio.params.starting = { position: { x: height - 1, y: j }, direction: 'N' }
    res = dio.part1(input) as number
    max = res > max ? res : max
  }
  return max
}

if(process.env.TESTING !== 'TRUE'){
  console.log('Part 1:', dio.part1(dio.input))
  console.log('Part 2:', dio.part2(dio.input))
}
