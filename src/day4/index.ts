import {matchStringTemplate, getDIO} from '../helpers/index.ts'
import path from 'path'

export const dio = getDIO(path.resolve('./src/day4'))

dio.params.template = /^Card\s+(\d+):\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+\|\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)$/g
const valueFromNumber = (num: number): number => num <= 1 ? num : 2 * valueFromNumber(num - 1)
dio.params.cutoff = 11

dio.part1 = input => input.map(it => {
  const numbers = matchStringTemplate(it, dio.params.template)
  const winning: string[] = numbers.slice(1, dio.params.cutoff)
  const choice: string[] = numbers.slice(dio.params.cutoff, numbers.length)
  const intersection = choice.filter(it => winning.includes(it))

  return valueFromNumber(intersection.length)
}).reduce((acc, curr) => acc + curr, 0).toString()

dio.part2 = input => {
  const times: number[] = Array(input.length).fill(1)
  input.forEach((it, index) => {
    const numbers = matchStringTemplate(it, dio.params.template)
    const winning: string[] = numbers.slice(1, dio.params.cutoff)
    const choice: string[] = numbers.slice(dio.params.cutoff, numbers.length)
    const matching = choice.filter(it => winning.includes(it)).length

    for (let i = index + 1; i < input.length && i - index <= matching; i++) {
      times[i] += times[index]
    }
  })
  return times.reduce((acc, curr) => acc + curr, 0).toString()
}

if(process.env.TESTING !== 'TRUE'){
  console.log('Part 1:', dio.part1(dio.input))
  console.log('Part 2:', dio.part2(dio.input))
}
