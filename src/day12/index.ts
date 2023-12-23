import { getDIO } from '../helpers/index.ts'
import { type CachedSolutions, solveLeft, stringToInput, inputToString } from './solvers.ts'
import path from 'path'

export const dio = getDIO(path.resolve('./src/day12'))

const cache: CachedSolutions = {}

dio.part1 = input => input.map(line => solveLeft(line, cache)).reduce((acc, curr) => acc + curr, 0)

dio.part2 = input => input.map(line => {
  const data = stringToInput(line)
  let count: number[] = []
  for (let i = 0; i < 5; i++) {
    count = [
      ...count,
      ...data.count
    ]
  }
  let springs = ''
  for (let i = 0; i < 5; i++) {
    if (i !== 0) {
      springs += '?'
    }
    springs += data.springs
  }
  return solveLeft(inputToString({ springs, count }), cache)
}).reduce((acc, curr) => acc + curr, 0)

if(process.env.TESTING !== 'TRUE'){
  console.log('Part 1:', dio.part1(dio.input))
  console.log('Part 2:', dio.part2(dio.input))
}
