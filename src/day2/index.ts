import {getAllMatches, getDIO} from '../helpers/index.ts'
import path from 'path'

export const dio = getDIO(path.resolve('./src/day2'))

dio.params = {
  maxRed: 12,
  maxGreen: 13,
  maxBlue: 14
}

dio.part1 = (input) => input.map(it => {
  const id = getAllMatches(it, /Game (\d+):/g, 1)[0]
  const red = getAllMatches(it, /(\d+) red/g, 1)
  const green = getAllMatches(it, /(\d+) green/g, 1)
  const blue = getAllMatches(it, /(\d+) blue/g, 1)
  if (red.some(count => parseInt(count) > dio.params.maxRed)) {
    return 0
  }
  if (green.some(count => parseInt(count) > dio.params.maxGreen)) {
    return 0
  }
  if (blue.some(count => parseInt(count) > dio.params.maxBlue)) {
    return 0
  }
  return parseInt(id)
}).reduce((acc, curr) => acc + curr, 0).toString()

dio.part2 = (input) => input.map(it => {
  const red = getAllMatches(it, /(\d+) red/g, 1)
  const green = getAllMatches(it, /(\d+) green/g, 1)
  const blue = getAllMatches(it, /(\d+) blue/g, 1)
  const minRed = red.reduce((acc, curr) => acc < parseInt(curr) ? parseInt(curr) : acc, 0)
  const minGreen = green.reduce((acc, curr) => acc < parseInt(curr) ? parseInt(curr) : acc, 0)
  const minBlue = blue.reduce((acc, curr) => acc < parseInt(curr) ? parseInt(curr) : acc, 0)
  return minRed * minGreen * minBlue
}).reduce((acc, curr) => acc + curr, 0).toString()

if(process.env.TESTING !== 'TRUE'){
  console.log('Part 1:', dio.part1(dio.input))
  console.log('Part 2:', dio.part2(dio.input))
}
