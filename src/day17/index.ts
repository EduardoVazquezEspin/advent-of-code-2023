import {PriorityQueue, type IComparable} from '../classes/index.ts'
import {getDIO} from '../helpers/index.ts'

import path from 'path'

export const dio = getDIO(path.resolve('./src/day17'))

type Direction = 'N' | 'E' | 'S' | 'W'

interface Position {
  x: number
  y: number
}

class TravellingNode implements IComparable {
  public position: Position
  public history: Direction[]
  public 'heat-loss': number

  constructor ({position, history, heat}: { position: Position, history: Direction[], heat: number }) {
    this.position = position
    this.history = history
    this['heat-loss'] = heat
  }

  compareTo (other: IComparable): number {
    if (!(other instanceof TravellingNode)) {
      return -1
    }
    return other['heat-loss'] - this['heat-loss']
  }
}

const getNeighbours = (node: TravellingNode, input: string[]): TravellingNode[] => {
  const {position: {x, y}, history, 'heat-loss': heat} = node
  const height = input.length
  const width = input[0].length
  const reducedHistory = history.filter((_, index) => index >= history.length - 3)
  const lastDirection = reducedHistory.length > 0 ? reducedHistory[reducedHistory.length - 1] : undefined
  const result: TravellingNode[] = []
  if (y > 0 && reducedHistory.filter(it => it === 'W').length < 3 && lastDirection !== 'E') {
    result.push(new TravellingNode({position: {x, y: y - 1}, history: [...history, 'W'], heat: heat + parseInt(input[x][y - 1])}))
  }
  if (y < width - 1 && reducedHistory.filter(it => it === 'E').length < 3 && lastDirection !== 'W') {
    result.push(new TravellingNode({position: {x, y: y + 1}, history: [...history, 'E'], heat: heat + parseInt(input[x][y + 1])}))
  }
  if (x > 0 && reducedHistory.filter(it => it === 'N').length < 3 && lastDirection !== 'S') {
    result.push(new TravellingNode({position: {x: x - 1, y}, history: [...history, 'N'], heat: heat + parseInt(input[x - 1][y])}))
  }
  if (x < height - 1 && reducedHistory.filter(it => it === 'S').length < 3 && lastDirection !== 'N') {
    result.push(new TravellingNode({position: {x: x + 1, y}, history: [...history, 'S'], heat: heat + parseInt(input[x + 1][y])}))
  }
  return result
}

const getNeighbours2 = (node: TravellingNode, input: string[]): TravellingNode[] => {
  const {position: {x, y}, history, 'heat-loss': heat} = node
  const height = input.length
  const width = input[0].length
  const reducedHistory10 = history.filter((_, index) => index >= history.length - 10)
  const reducedHistory4 = history.filter((_, index) => index >= history.length - 4)
  const lastDirection = history.length > 0 ? history[history.length - 1] : undefined
  const result: TravellingNode[] = []
  const canGoWest = ((lastDirection === 'W' || lastDirection === undefined) && reducedHistory10.filter(it => it === 'W').length < 10) ||
                    (lastDirection !== 'W' && lastDirection !== 'E' && reducedHistory4.filter(it => it === lastDirection).length === 4)
  if (y > 0 && canGoWest) {
    result.push(new TravellingNode({position: {x, y: y - 1}, history: [...history, 'W'], heat: heat + parseInt(input[x][y - 1])}))
  }
  const canGoEast = ((lastDirection === 'E' || lastDirection === undefined) && reducedHistory10.filter(it => it === 'E').length < 10) ||
                    (lastDirection !== 'W' && lastDirection !== 'E' && reducedHistory4.filter(it => it === lastDirection).length === 4)
  if (y < width - 1 && canGoEast) {
    result.push(new TravellingNode({position: {x, y: y + 1}, history: [...history, 'E'], heat: heat + parseInt(input[x][y + 1])}))
  }
  const canGoNorth = ((lastDirection === 'N' || lastDirection === undefined) && reducedHistory10.filter(it => it === 'N').length < 10) ||
                      (lastDirection !== 'N' && lastDirection !== 'S' && reducedHistory4.filter(it => it === lastDirection).length === 4)
  if (x > 0 && canGoNorth) {
    result.push(new TravellingNode({position: {x: x - 1, y}, history: [...history, 'N'], heat: heat + parseInt(input[x - 1][y])}))
  }
  const canGoSouth = ((lastDirection === 'S' || lastDirection === undefined) && reducedHistory10.filter(it => it === 'S').length < 10) ||
                      (lastDirection !== 'N' && lastDirection !== 'S' && reducedHistory4.filter(it => it === lastDirection).length === 4)
  if (x < height - 1 && canGoSouth) {
    result.push(new TravellingNode({position: {x: x + 1, y}, history: [...history, 'S'], heat: heat + parseInt(input[x + 1][y])}))
  }
  return result
}

dio.part1 = input => {
  const height = input.length
  const width = input[0].length
  const heatLoss: Array<Array<Record<string, number>>> = Array(height).fill(1).map(() => Array(width).fill(1).map(() => ({ })))
  const queue = new PriorityQueue<TravellingNode>()
  queue.enqueue(new TravellingNode({position: {x: 0, y: 0}, history: [], heat: 0}))
  let top
  while ((top = queue.dequeue()) !== undefined && Object.keys(heatLoss[height - 1][width - 1]).length === 0) {
    const {position: {x, y}, history, 'heat-loss': heat} = top
    const stringHistory = history.filter((_, index) => index >= history.length - 3).reduce((acc, curr) => acc + curr, '')
    if (heatLoss[x][y][stringHistory] === undefined) {
      heatLoss[x][y][stringHistory] = heat
      const neighbours = getNeighbours(top, input)
      neighbours.forEach(it => { queue.enqueue(it) })
    }
  }
  if (Object.keys(heatLoss[height - 1][width - 1]).length === 0) {
    throw new Error('Solution not found')
  }
  const key = Object.keys(heatLoss[height - 1][width - 1])
  return heatLoss[height - 1][width - 1][key[0]]
}

dio.part2 = input => {
  const height = input.length
  const width = input[0].length
  const heatLoss: Array<Array<Record<string, number>>> = Array(height).fill(1).map(() => Array(width).fill(1).map(() => ({ })))
  const queue = new PriorityQueue<TravellingNode>()
  queue.enqueue(new TravellingNode({position: {x: 0, y: 0}, history: [], heat: 0}))
  let top
  while ((top = queue.dequeue()) !== undefined && Object.keys(heatLoss[height - 1][width - 1]).length === 0) {
    const {position: {x, y}, history, 'heat-loss': heat} = top
    const stringHistory = history.filter((_, index) => index >= history.length - 10).reduce((acc, curr) => acc + curr, '')
    if (heatLoss[x][y][stringHistory] === undefined) {
      heatLoss[x][y][stringHistory] = heat
      const neighbours = getNeighbours2(top, input)
      neighbours.forEach(it => { queue.enqueue(it) })
    }
  }
  if (Object.keys(heatLoss[height - 1][width - 1]).length === 0) {
    throw new Error('Solution not found')
  }
  const key = Object.keys(heatLoss[height - 1][width - 1])
  return heatLoss[height - 1][width - 1][key[0]]
}

if(process.env.TESTING !== 'TRUE'){
  console.log('Part 1:', dio.part1(dio.input))
  console.log('Part 2:', dio.part2(dio.input))
}
