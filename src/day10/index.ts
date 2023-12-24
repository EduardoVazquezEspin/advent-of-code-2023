import {getDIO} from '../helpers/index.ts'
import path from 'path'

export const dio = getDIO(path.resolve('./src/day10'))

type Direction = 'N' | 'E' | 'S' | 'W'

const directionToVector: Record<Direction, [number, number]> = {
  N: [-1, 0],
  E: [0, 1],
  S: [1, 0],
  W: [0, -1]
}

type Position = [number, number, Direction]

type PositionWithNewDistance = [number, number, Direction, number]

interface AreaCalc {
  area: number
  x: number
  y: number
  distance: number
}

type PositionWithAreaCalc = [number, number, Direction, AreaCalc]

type Pipe = Partial<Record<Direction, Direction>>

type PipeShape = '|' | '-' | 'L' | 'J' | '7' | 'F'

type Pipes = Record<PipeShape, Pipe>

const pipes: Pipes = {
  '|': {
    N: 'N',
    S: 'S'
  },
  '-': {
    E: 'E',
    W: 'W'
  },
  L: {
    S: 'E',
    W: 'N'
  },
  J: {
    E: 'N',
    S: 'W'
  },
  7: {
    E: 'S',
    N: 'W'
  },
  F: {
    W: 'S',
    N: 'E'
  }
}

const getStartPosition = (input: string[]): [number, number] => {
  for (let i = 0; i < input.length; i++) {
    for (let j = 0; j < input[i].length; j++) {
      if (input[i][j] === 'S') {
        return [i, j]
      }
    }
  }
  throw new Error('Starting Position Not Found')
}

const getNeighbours = (x: number, y: number, width: number, height: number): Position[] => {
  const neighbours: Position[] = []
  if (x > 0) {
    neighbours.push([x - 1, y, 'N'])
  }
  if (x < width - 1) {
    neighbours.push([x + 1, y, 'S'])
  }
  if (y > 0) {
    neighbours.push([x, y - 1, 'W'])
  }
  if (y < height - 1) {
    neighbours.push([x, y + 1, 'E'])
  }
  return neighbours
}

dio.part1 = input => {
  const [x, y] = getStartPosition(input)
  const width = input.length
  const height = input[0].length
  const distance = Array(width).fill(-1).map(() => Array(height).fill(-1))
  distance[x][y] = 0
  const queue: PositionWithNewDistance[] = getNeighbours(x, y, width, height).map(it => [...it, 1])
  let top: PositionWithNewDistance | undefined
  while ((top = queue.shift()) !== undefined && distance[top[0]][top[1]] === -1) {
    const newDistance: number = top[3]
    const char = input[top[0]][top[1]] as PipeShape
    if (pipes[char]?.[top[2]] !== undefined) {
      distance[top[0]][top[1]] = newDistance
      const direction: Direction = pipes[char][top[2]] as Direction
      const neighbours: PositionWithNewDistance[] = getNeighbours(top[0], top[1], width, height).map(it => [...it, newDistance + 1])
      const filtered = neighbours.filter(it => it[2] === direction)
      queue.push(...filtered)
    }
  }
  if (top === undefined) {
    throw new Error('Loop Not Found')
  }
  return distance[top[0]][top[1]]
}

dio.part2 = input => {
  const [x, y] = getStartPosition(input)
  const width = input.length
  const height = input[0].length
  const area: number[][] = Array(width).fill(-1).map(() => Array(height).fill(-1))
  const distance = Array(width).fill(-1).map(() => Array(height).fill(-1))
  area[x][y] = 0
  distance[x][y] = 0

  const queue: PositionWithAreaCalc[] = getNeighbours(x, y, width, height).map(it => {
    const [x, y] = directionToVector[it[2]]
    return [...it, {area: 0, x, y, distance: 1}]
  }

  )
  let top: PositionWithAreaCalc | undefined
  while ((top = queue.shift()) !== undefined && area[top[0]][top[1]] === -1) {
    const areaCalc: AreaCalc = top[3]
    const char = input[top[0]][top[1]] as PipeShape
    if (pipes[char]?.[top[2]] !== undefined) {
      area[top[0]][top[1]] = areaCalc.area
      distance[top[0]][top[1]] = areaCalc.distance
      const direction: Direction = pipes[char][top[2]] as Direction
      const neighbours: PositionWithAreaCalc[] = getNeighbours(top[0], top[1], width, height).map(it => {
        const [x, y] = directionToVector[it[2]]
        const newArea = areaCalc.area + areaCalc.x * y - areaCalc.y * x
        const [newX, newY] = [areaCalc.x + x, areaCalc.y + y]
        return [...it, {area: newArea, x: newX, y: newY, distance: areaCalc.distance + 1}]
      })
      const filtered = neighbours.filter(it => it[2] === direction)
      queue.push(...filtered)
    }
  }
  if (top === undefined) {
    throw new Error('Loop Not Found')
  }
  const finalArea = Math.abs((area[top[0]][top[1]] - top[3].area) / 2)
  const totalDistance = top[3].distance + distance[top[0]][top[1]]
  const innerPoints = finalArea - totalDistance / 2 + 1
  return innerPoints
}

if(process.env.TESTING !== 'TRUE'){
  console.log('Part 1:', dio.part1(dio.input))
  console.log('Part 2:', dio.part2(dio.input))
}
