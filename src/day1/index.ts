import {getDIO, toNumber} from '../helpers/index.ts'
import path from 'path'

export const dio = getDIO(path.resolve('./src/day1'))

dio.part1 = input => input.map(it => {
  const digits = it.match(/[0-9]/g) as string[]
  return parseInt(digits[0] + digits[digits.length - 1])
}).reduce((acc, curr) => acc + curr, 0)

dio.part2 = input => input.map(it => {
  const first = it.match(/([0-9]|one|two|three|four|five|six|seven|eight|nine)/) as string[]
  const last = it.split('').reverse().join('').match(/([0-9]|eno|owt|eerht|ruof|evif|xis|neves|thgie|enin)/) as string[]
  return 10 * toNumber(first[0]) + toNumber(last[0].split('').reverse().join(''))
}).reduce((acc, curr) => acc + curr, 0)

if(process.env.TESTING !== 'TRUE'){
  console.log('Part 1:', dio.part1(dio.input))
  console.log('Part 2:', dio.part2(dio.input))
}
