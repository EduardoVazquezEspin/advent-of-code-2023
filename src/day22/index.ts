import { getDIO, matchStringTemplate, topologicalSort } from '../helpers/index.ts'
import path from 'path'

export const dio = getDIO(path.resolve('./src/day22'))

type Position = [number, number, number]

interface Brick {
  start: Position
  end: Position
  above: Brick[]
  below: Brick[]
}

const readInput = (input: string[]): Brick[] =>
  input.map(line => {
    const matches: string[] = matchStringTemplate(line, /^(\d+),(\d+),(\d+)~(\d+),(\d+),(\d+)$/g)
    const integers: number[] = matches.map(it => parseInt(it))
    return {
      start: [integers[0], integers[1], integers[2]],
      end: [integers[3], integers[4], integers[5]],
      above: [],
      below: []
    }
  })

const getRange = (a: number, b: number): [number, number] => {
  if (a <= b) {
    return [a, b]
  }
  return [b, a]
}

const getVerticalDistance = (upper: Brick, lower: Brick): number => {
  const upperRangeX = getRange(upper.start[0], upper.end[0])
  const lowerRangeX = getRange(lower.start[0], lower.end[0])
  const xLength = Math.min(lowerRangeX[1], upperRangeX[1]) - Math.max(lowerRangeX[0], upperRangeX[0]) + 1
  if (xLength <= 0) {
    return -1
  }

  const upperRangeY = getRange(upper.start[1], upper.end[1])
  const lowerRangeY = getRange(lower.start[1], lower.end[1])
  const yLength = Math.min(lowerRangeY[1], upperRangeY[1]) - Math.max(lowerRangeY[0], upperRangeY[0]) + 1
  if (yLength <= 0) {
    return -1
  }

  return Math.min(upper.start[2], upper.end[2]) - Math.max(lower.start[2], lower.end[2]) - 1
}

dio.part1 = input => {
  const bricks = readInput(input)
  for (let i = 0; i < bricks.length - 1; i++) {
    for (let j = i + 1; j < bricks.length; j++) {
      if (getVerticalDistance(bricks[i], bricks[j]) >= 0) {
        bricks[i].below.push(bricks[j])
        bricks[j].above.push(bricks[i])
      } else if (getVerticalDistance(bricks[j], bricks[i]) >= 0) {
        bricks[i].above.push(bricks[j])
        bricks[j].below.push(bricks[i])
      }
    }
  }
  const sort = topologicalSort<Brick>(bricks, (brick: Brick) => brick.below)

  for (let i = 0; i < sort.length; i++) {
    const distances: number[] = [Math.min(sort[i].start[2], sort[i].end[2]) - 1]

    sort[i].below.forEach(brick => {
      const d = getVerticalDistance(sort[i], brick)
      if (d >= 0) {
        distances.push(d)
      }
    })

    const min = distances.reduce((acc, curr) => acc <= curr ? acc : curr, distances[0])
    sort[i].start[2] -= min
    sort[i].end[2] -= min
  }

  bricks.forEach(brick => {
    brick.above = brick.above.filter(other => getVerticalDistance(other, brick) === 0)
    brick.below = brick.below.filter(other => getVerticalDistance(brick, other) === 0)
  })

  return bricks.filter(it => it.above.every(other => other.below.length >= 2)).length
}

dio.part2 = input => {
  const bricks = readInput(input)
  for (let i = 0; i < bricks.length - 1; i++) {
    for (let j = i + 1; j < bricks.length; j++) {
      if (getVerticalDistance(bricks[i], bricks[j]) >= 0) {
        bricks[i].below.push(bricks[j])
        bricks[j].above.push(bricks[i])
      } else if (getVerticalDistance(bricks[j], bricks[i]) >= 0) {
        bricks[i].above.push(bricks[j])
        bricks[j].below.push(bricks[i])
      }
    }
  }
  const sort = topologicalSort<Brick>(bricks, (brick: Brick) => brick.below)

  for (let i = 0; i < sort.length; i++) {
    const distances: number[] = [Math.min(sort[i].start[2], sort[i].end[2]) - 1]

    sort[i].below.forEach(brick => {
      const d = getVerticalDistance(sort[i], brick)
      if (d >= 0) {
        distances.push(d)
      }
    })

    const min = distances.reduce((acc, curr) => acc <= curr ? acc : curr, distances[0])
    sort[i].start[2] -= min
    sort[i].end[2] -= min
  }

  bricks.forEach(brick => {
    brick.above = brick.above.filter(other => getVerticalDistance(other, brick) === 0)
    brick.below = brick.below.filter(other => getVerticalDistance(brick, other) === 0)
  })

  const numberOfBricksFall: number[] = bricks.map(it => {
    const queue: Brick[] = [it]
    let top: Brick | undefined
    const removed: Set<Brick> = new Set<Brick>()
    while ((top = queue.shift()) !== undefined) {
      if (!removed.has(top)) {
        if (top === it || top.below.every(it => removed.has(it))) {
          removed.add(top)
          top.above.forEach(other => {
            queue.push(other)
          })
        }
      }
    }
    return removed.size - 1
  })

  return numberOfBricksFall.reduce((acc, curr) => acc + curr, 0)
}

if(process.env.TESTING !== 'TRUE'){
  console.log('Part 1:', dio.part1(dio.input))
  console.log('Part 2:', dio.part2(dio.input))
}
