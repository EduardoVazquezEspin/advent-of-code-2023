import {getDIO} from '../helpers/index.ts'
import path from 'path'

export const dio = getDIO(path.resolve('./src/day21'))

interface Position {
  x: number
  y: number
}

interface BFS_DO {
  position: Position
  distance: number
  payload?: Record<string, any>
}

const getStartingPosition = (input: string[]): Position => {
  for (let i = 0; i < input.length; i++) {
    for (let j = 0; j < input[i].length; j++) {
      if (input[i][j] === 'S') {
        return {x: i, y: j}
      }
    }
  }
  throw new Error('Starting Position Not Found')
}

const getNeighbours = (position: Position, input: string[]): Position[] => {
  const result: Position[] = []
  const {x, y} = position
  if (x > 0 && input[x - 1][y] !== '#') {
    result.push({x: x - 1, y})
  }
  if (x < input.length - 1 && input[x + 1][y] !== '#') {
    result.push({x: x + 1, y})
  }
  if (y > 0 && input[x][y - 1] !== '#') {
    result.push({x, y: y - 1})
  }
  if (y < input[x].length - 1 && input[x][y + 1] !== '#') {
    result.push({x, y: y + 1})
  }
  return result
}

const getNeighbours2 = (position: Position, real: Position, input: string[]): Array<[Position, Position]> => {
  const result: Array<[Position, Position]> = []
  const {x, y} = position
  const upX = x === 0 ? input.length - 1 : x - 1
  if (input[upX][y] !== '#') {
    result.push([{x: upX, y}, {x: real.x - 1, y: real.y}])
  }
  const downX = x === input.length - 1 ? 0 : x + 1
  if (input[downX][y] !== '#') {
    result.push([{x: downX, y}, {x: real.x + 1, y: real.y}])
  }
  const leftY = y === 0 ? input[x].length - 1 : y - 1
  if (input[x][leftY] !== '#') {
    result.push([{x, y: leftY}, {x: real.x, y: real.y - 1}])
  }
  const rightY = y === input[x].length - 1 ? 0 : y + 1
  if (input[x][rightY] !== '#') {
    result.push([{x, y: rightY}, {x: real.x, y: real.y + 1}])
  }
  return result
}

dio.part1 = input => {
  const start = getStartingPosition(input)
  const queue: BFS_DO[] = [{position: start, distance: 0}]
  const height = input.length
  const width = input[0].length
  const distance: number[][] = Array(height).fill([]).map(() => Array(width).fill(-1))
  let solutions: number = 0
  let top: BFS_DO | undefined
  while ((top = queue.shift()) !== undefined) {
    const topDistance: number = top.distance
    if (distance[top.position.x][top.position.y] === -1 && topDistance <= dio.params.steps) {
      distance[top.position.x][top.position.y] = topDistance
      if (topDistance % 2 === dio.params.steps % 2) {
        solutions++
      }
      const neighbours = getNeighbours(top.position, input)
      neighbours.forEach(neighbour => queue.push({position: neighbour, distance: topDistance + 1}))
    }
  }
  return solutions
}

// Naive solution

// dio.part2 = input => {
//   const start = getStartingPosition(input)
//   const queue: BFS_DO[] = [{ position: start, distance: 0, payload: start }]
//   const distance: Record<number, Record<number, number>> = {}
//   let solutions: number = 0
//   let top: BFS_DO | undefined
//   while ((top = queue.shift()) !== undefined) {
//     const topDistance: number = top.distance
//     const { position, payload } = top
//     const real = payload as Position
//     let hasBeenCalculated: boolean = true
//
//     if (distance[real.x] === undefined) {
//       hasBeenCalculated = false
//       distance[real.x] = { [real.y]: topDistance }
//     } else if (distance[real.x][real.y] === undefined) {
//       hasBeenCalculated = false
//       distance[real.x][real.y] = topDistance
//     }
//
//     if (!hasBeenCalculated && topDistance <= dio.params.steps) {
//       if (topDistance % 2 === dio.params.steps % 2) {
//         solutions++
//       }
//       const neighbours = getNeighbours2(position, real, input)
//       neighbours.forEach(([map, real]: [Position, Position]) => queue.push({ position: map, distance: topDistance + 1, payload: real }))
//     }
//   }
//   return solutions
// }

type History = number[]

interface NewtonDiff {
  diffs: History[]
  order: number
  finished: boolean
}

export const getNewtonDiff = (history: History, order: number | undefined = undefined): NewtonDiff => {
  const diffs: History[] = [history]
  let curr = history
  let iter = 0
  /* eslint-disable no-unmodified-loop-condition */
  while (curr.some(it => it !== 0) && (order === undefined || iter <= order)) {
    const newDiff = []
    for (let i = 0; i < curr.length - 1; i++) {
      newDiff.push(curr[i + 1] - curr[i])
    }
    curr = newDiff
    diffs.push(newDiff)
    iter++
  }
  return {diffs, order: iter - 1, finished: curr.every(it => it === 0)}
}

const getNodesByDistance = (input: string[], max: number): number[] => {
  const start = getStartingPosition(input)
  const queue: BFS_DO[] = [{position: start, distance: 0, payload: start}]
  const distance: Record<number, Record<number, number>> = {}
  const nodes: number[] = []
  let top: BFS_DO | undefined
  while ((top = queue.shift()) !== undefined) {
    const topDistance: number = top.distance
    const {position, payload} = top
    const real = payload as Position
    let hasBeenCalculated: boolean = true

    if (distance[real.x] === undefined) {
      hasBeenCalculated = false
      distance[real.x] = {[real.y]: topDistance}
    } else if (distance[real.x][real.y] === undefined) {
      hasBeenCalculated = false
      distance[real.x][real.y] = topDistance
    }

    if (!hasBeenCalculated && topDistance <= max) {
      if (nodes[topDistance] === undefined) {
        nodes.push(0)
      }
      nodes[topDistance]++
      const neighbours = getNeighbours2(position, real, input)
      neighbours.forEach(([map, real]: [Position, Position]) => queue.push({position: map, distance: topDistance + 1, payload: real}))
    }
  }
  return nodes
}

dio.part2 = input => {
  const DIFF_SAMPLE = 5
  const MAX_DISTANCE = Math.min(700, dio.params.steps)
  const nodes = getNodesByDistance(input, MAX_DISTANCE) // #nodes at exactly distance i where i is the index

  // We use Newton differences to find a polynomial pattern
  // This pattern is not on f(n) = #nodes at distance n
  // But can be found in f(Δn + n_0) where Δ > 0 is an integer that depends on the graph

  let hasFinished: boolean = false
  let delta: number
  for (delta = 1; !hasFinished && delta * DIFF_SAMPLE < MAX_DISTANCE; delta++) {
    let worksForAll = true
    for (let displacement = 0; worksForAll && displacement < delta; displacement++) {
      const filteredNodes = nodes.filter((_, index) => {
        if ((nodes.length - 1 - index) % delta !== 0) {
          return false
        }
        return index >= nodes.length - DIFF_SAMPLE * delta
      })
      const diffs = getNewtonDiff(filteredNodes, 1)
      worksForAll = diffs.finished
    }
    hasFinished = worksForAll
  }
  delta--

  if (!hasFinished && nodes.length - 1 < dio.params.steps) {
    throw new Error('Pattern not found')
  }

  // From this point onwards we infer the values of nodes from the previous
  // It behaves as a linear function on f(Δn + n_0) where n_0 is the offset
  // A linear function satisfies the property
  // f(n+1) = 2f(n) - f(n-1)
  // Taking into account the delta offset we got
  // f(n) = 2f(n-Δ) - f(n-2Δ)
  // I know I could have used Newton differences (as I have used to find delta)
  // But this is cleaner

  for (let i = nodes.length; i <= dio.params.steps; i++) {
    nodes.push(2 * nodes[i - delta] - nodes[i - 2 * delta])
  }

  return nodes.filter((_, index) => index <= dio.params.steps)
    .reduce((acc, curr, index) => acc + (index % 2 === dio.params.steps % 2 ? curr : 0), 0)
}

if(process.env.TESTING !== 'TRUE'){
  dio.params.steps = 64
  console.log('Part 1:', dio.part1(dio.input))
  dio.params.steps = 26501365
  console.log('Part 2:', dio.part2(dio.input))
}

